var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Captcha = require("../models/captcha");
var CMahasiswa = require("../models/cmahasiswa");
var db = require("../config/database");
var jwt = require("jsonwebtoken");
var passport = require("passport");
// var bcrypt = require('bcrypt-nodejs');
var bcrypt = require("bcrypt");
var blacklist = require("express-jwt-blacklist");
var { users } = require("../services");
var refInfo = require("../models/refInfo");

const SECRET = require("../constants/secret");

/* GET users listing. */
router.get("/all", function (req, res) {
    return db
        .transaction(function (transaction) {
            return User.findAll({ transaction }).then((users) => {
                res.send(users);
            });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

router.get("/id/:id", function (req, res) {
    return db
        .transaction(function (transaction) {
            return User.findById(req.params.id, { transaction }).then((users) => {
                if (users) {
                    res.send(users);
                } else {
                    res.send({ msg: "data tidak ditemukan" });
                }
            });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

// Add or Update
router.post("/add", function (req, res) {
    return db
        .transaction(function (transaction) {
            User.findById(req.body.username_lama, { transaction }).then((users) => {
                if (users) {
                    //  Kalau password gak kosong, berarti ganti password
                    let data = {};
                    if (req.body.password !== "") {
                        data = {
                            no_peserta: req.body.no_peserta,
                            password: bcrypt.hashSync(req.body.password),
                        };
                    } else {
                        // gak usah ganti kalau kosong
                        data = {
                            no_peserta: req.body.no_peserta,
                        };
                    }

                    return User.update(data, {
                        where: {
                            no_peserta: req.body.username_lama,
                        },
                    }).then((data) => {
                        res.send({ msg: "success", data });
                    });
                } else {
                    return User.create(
                        {
                            no_peserta: req.body.no_peserta,
                            password: bcrypt.hashSync(req.body.password),
                            role: "admin",
                        },
                        { fields: ["no_peserta", "password", "role"] }
                    ).then((data) => {
                        res.send({ msg: "success", data });
                    });
                }
            });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

// Delete
router.delete(
    "/delete/:username",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db
            .transaction(function (transaction) {
                User.destroy({
                    where: {
                        no_peserta: req.params.username,
                        role: "admin",
                    },
                    transaction
                }).then(() => {
                    res.json("Data telah dihapus!");
                });
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    }
);

router.put("/edit/id/:id", function (req, res,) {
    return db
        .transaction(function (transaction) {
            User.update({
                no_peserta: req.body.no_peserta,
                password: req.body.password,
            }, {
                where: {
                    no_peserta: req.params.id,
                },
                transaction
            }).then((data) => {
                res.send({ msg: "success", data });
            });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

router.post("/login", function (req, res) {
    User.findOne({
        where: {
            no_peserta: req.body.no_peserta,
            // no_peserta: '4220024505'
        },
        include: [{ model: CMahasiswa, as: "cmahasiswa" }],
    })
        .then((data) => {
            if (!data) {
                res.status(401).json({ message: "no such user found" });
            }

            if (data.role === 'belum_lengkap') {
                res.status(403).json({ message: "Anda belum menyelesaikan verifikasi akademik" });
            }

            if (bcrypt.compareSync(req.body.password, data.password)) {
                Captcha.findOne({
                    where: {
                        kode: req.body.kode,
                    },
                }).then((captcha) => {
                    if (captcha.jawaban == req.body.jawaban) {
                        var payload = { id: data.no_peserta };
                        var token = jwt.sign(payload, SECRET, { expiresIn: 18000 });
                        res.json({
                            message: "ok",
                            token: token,
                            flag: data.cmahasiswa ? data.cmahasiswa.flag : "",
                        });
                    } else {
                        res.status(401).json({ message: "pertanyaan keamanan salah" });
                    }
                });
            } else {
                res.status(401).json({ message: "passwords did not match" });
            }
        })
        .catch((err) => {
            console.log({ err });
            res.status(err.status || 500).json(err);
        });
});

router.get(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        blacklist.revoke(req.user);
        res.sendStatus(200);
    }
);

router.get(
    "/getNopes",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db
            .transaction(function (transaction) {
                User.findOne({
                    attributes: ["no_peserta"],
                    where: {
                        no_peserta: req.user.no_peserta,
                    },
                    transaction,
                }).then((data) => {
                    // Do something with the user
                    res.send(data.no_peserta);
                });
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    }
);

router.get(
    "/getUser",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        users
            .getUser(req.user.no_peserta)
            .then(function (response) {
                res.json(response);
            })
            .catch(function (err) {
                res.json(err);
            });
    }
);

router.get("/hash-all", function (req, res) {
    return db
        .transaction(function (transaction) {
            User.findAll({ transaction }).then(function (data) {
                console.log("baca");
                for (let i in data) {
                    console.log(i);
                    User.update(
                        {
                            password: bcrypt.hashSync(data[i].password),
                        },
                        {
                            where: {
                                no_peserta: data[i].no_peserta,
                                role: "cmahasiswa",
                            },
                        }
                    ).then(function () {
                        console.log(data[i].password);
                    });
                }
                res.status(200).send("ok");
            });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

module.exports = router;
