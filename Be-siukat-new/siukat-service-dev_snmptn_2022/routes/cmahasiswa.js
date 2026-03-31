var express = require("express");
var router = express.Router();
var CMahasiswa = require("../models/cmahasiswa");
var LogCMahasiswa = require("../models/log_cmahasiswa");
var Fakultas = require("../models/fakultas");
var Prodi = require("../models/prodi");
var Provinsi = require("../models/provinsi");
var Kabkot = require("../models/kabkot");
var Kecamatan = require("../models/kecamatan");
var Info = require("../models/info");
var Value = require("../models/value");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var db = require("../config/database");

var global = require("../global");

var moment = require("moment");
var db = require("../config/database");
var passport = require("passport");
var {
    cmahasiswa,
    ayah,
    ibu,
    kendaraan,
    wali,
    rumah,
    listrik,
    pendukung,
    value,
    users,
    ukt,
    prodi,
} = require("../services");
var multer = require("multer");
var multerConf = require("../config/multer");

var timestamp = moment().format().slice(0, 19).replace("T", " ");

var upload = multer(multerConf);

router.get("/all", function (req, res, next) {
    return db
        .transaction(function (t) {
            cmahasiswa.all().then(function (response) {
                res.status(200).json(response);
            });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

router.get(
    "/no-peserta/:no_peserta",
    passport.authenticate("jwt", { session: false }),
    function (req, res, next) {
        return db
            .transaction(function (t) {
                CMahasiswa.findOne({
                    where: {
                        no_peserta: req.params.no_peserta,
                        atribut: "sanggah",
                    },
                    include: [
                        { model: Fakultas, as: "fakultas" },
                        Prodi,
                        Provinsi,
                        Kabkot,
                        Kecamatan,
                    ],
                })
                    .then((users) => {
                        if (users) {
                            res.send(users);
                        } else {
                            return CMahasiswa.findOne({
                                where: {
                                    no_peserta: req.params.no_peserta,
                                    atribut: "original",
                                },
                                include: [
                                    { model: Fakultas, as: "fakultas" },
                                    Prodi,
                                    Provinsi,
                                    Kabkot,
                                    Kecamatan,
                                ],
                            });
                        }
                    })
                    .then((users) => {
                        if (users) {
                            res.send(users);
                        } else {
                            res.send({ msg: "data tidak ditemukan" });
                        }
                    });
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json(err);
            });
    }
);

router.post("/add", passport.authenticate("jwt", { session: false }), function (
    req,
    res,
    next
) {
    return db.transaction(function (t) {
        req.body.waktu_selesai = timestamp;
        cmahasiswa
            .add(req.body, "original")
            .then(function (response) {
                res.status(200).json(response);
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    });
});

router.put(
    "/edit",
    passport.authenticate("jwt", { session: false }),
    upload.single("file_foto_cmahasiswa"),
    function (req, res, next) {
        return db
            .transaction(function (t) {
                var no_peserta = req.user.no_peserta;
                CMahasiswa.findOne({
                    where: {
                        no_peserta: no_peserta,
                    },
                }).then((users) => {
                    cmahasiswa
                        .addLog(users, req.user.no_peserta, timestamp)
                        .then(function (response) {
                            cmahasiswa
                                .edit(req, no_peserta, timestamp, "original")
                                .then(function (response) {
                                    res.json(response);
                                })
                                .catch(function (err) {
                                    res.status(500).json(err);
                                });
                        })
                        .catch(function (err) {
                            res.status(500).json(err);
                        });
                });
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    }
);

router.put(
    "/edit/:no_peserta",
    passport.authenticate("jwt", { session: false }),
    upload.single("file_foto_cmahasiswa"),
    function (req, res, next) {
        return db
            .transaction(function (t) {
                var no_peserta = req.params.no_peserta;
                CMahasiswa.findOne({
                    where: {
                        no_peserta: no_peserta,
                        atribut: "sanggah",
                        flag: "sanggah_ukt",
                    },
                }).then((users) => {
                    cmahasiswa
                        .addLog(users, req.params.no_peserta, timestamp)
                        .then(function (response) {
                            cmahasiswa
                                .edit(req, no_peserta, timestamp, "sanggah")
                                .then(function (response) {
                                    res.status(200).json(response);
                                })
                                .catch(function (err) {
                                    res.status(500).json(err);
                                });
                        })
                        .catch(function (err) {
                            res.status(500).json(err);
                        });
                });
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    }
);

router.put(
    "/ukt-tinggi",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            var no_peserta = req.user.no_peserta;
            cmahasiswa
                .uktTinggi(req, no_peserta)
                .then(function (response) {
                    res.status(200).json(response);
                })
                .catch(function (err) {
                    res.status(500).json(err);
                });
        });
    }
);

router.put(
    "/ukt-tinggi-tidak",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            var no_peserta = req.user.no_peserta;
            cmahasiswa
                .uktTinggiTidak(no_peserta)
                .then(function (response) {
                    res.status(200).json(response);
                })
                .catch(function (err) {
                    res.status(500).json(err);
                });
        });
    }
);

router.get(
    "/verifikasi",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            var obj = {};
            users
                .getUser(req.user.no_peserta)
                .then((response) => {
                    obj.data = response;
                    return cmahasiswa.checkData(req.user.no_peserta);
                })
                .then((response) => {
                    obj.cmahasiswa = response;
                    console.log("a" + obj.cmahasiswa);
                    return ayah.checkData(req.user.no_peserta, obj.data);
                })
                .then((response) => {
                    obj.ayah = response;
                    return ibu.checkData(req.user.no_peserta, obj.data);
                })
                .then((response) => {
                    obj.ibu = response;
                    return kendaraan.checkData(req.user.no_peserta);
                })
                .then((response) => {
                    obj.kendaraan = response;
                    return wali.checkData(req.user.no_peserta, obj.data);
                })
                .then((response) => {
                    obj.wali = response;
                    return rumah.checkData(req.user.no_peserta);
                })
                .then((response) => {
                    obj.rumah = response;
                    return listrik.checkData(req.user.no_peserta);
                })
                .then((response) => {
                    obj.listrik = response;
                    return pendukung.checkData(req.user.no_peserta, obj.data);
                })
                .then((response) => {
                    obj.pendukung = response;
                    return pendukung.checkDataVerifikasi(req.user.no_peserta, obj.data);
                })
                .then((response) => {
                    obj.verifikasi =
                        obj.cmahasiswa &&
                        obj.ayah &&
                        obj.ibu &&
                        obj.kendaraan &&
                        obj.wali &&
                        obj.rumah &&
                        obj.listrik &&
                        obj.pendukung;
                    res.status(200).json(obj);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json("Gagal memverifikasi data");
                });
        });
    }
);

router.put(
    "/flag-terima",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            cmahasiswa
                .flagTerima(req.user.no_peserta)
                .then(function (response) {
                    res.status(200).json("Anda telah menerima hasil UKT");
                })
                .catch(function (err) {
                    res.status(500).json(err);
                });
        });
    }
);

router.put(
    "/flag-klarifikasi",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            cmahasiswa
                .flagKlarifikasi(req.user.no_peserta)
                .then(function (response) {
                    return users.getUser(req.user.no_peserta);
                })
                .then(function (response) {
                    return cmahasiswa.add(response, "sanggah");
                })
                .then(function (response) {
                    return ayah.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return ayah.add(response, "sanggah");
                })
                .then(function (response) {
                    return ibu.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return ibu.add(response, "sanggah");
                })
                .then(function (response) {
                    return kendaraan.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return kendaraan.add(response, "sanggah");
                })
                .then(function (response) {
                    return listrik.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return listrik.add(response, "sanggah");
                })
                .then(function (response) {
                    return pendukung.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return pendukung.add(response, "sanggah");
                })
                .then(function (response) {
                    return rumah.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return rumah.add(response, "sanggah");
                })
                .then(function (response) {
                    return wali.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return wali.add(response, "sanggah");
                })
                .then(function (response) {
                    return value.getByLoggedIn(req.user.no_peserta);
                })
                .then(function (response) {
                    return value.add(response, "sanggah");
                })
                .then(function (response) {
                    res.status(200).json("Anda telah memilih klarifikasi UKT");
                })
                .catch(function (err) {
                    res.status(500).json();
                });
        });
    }
);

router.post(
    "/datatable",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        // Init requirements
        let perPage = parseInt(req.body.perPage, 10),
            object = {
                currentPage: req.body.page,
                perPage: perPage,
                keyword: req.body.keyword,
            };
        let options = {
            limit: perPage,
            offset: (req.body.page - 1) * perPage,
            include: [{ model: Fakultas, as: "fakultas" }],
        };

        // Custom Query When Searching
        if (req.body.keyword !== "") {
            options.where = {
                [Op.or]: [
                    {
                        no_peserta: {
                            [Op.like]: req.body.keyword + "%",
                        },
                    },
                    {
                        nama_cmahasiswa: {
                            [Op.like]: "%" + req.body.keyword + "%",
                        },
                    },
                    {
                        flag: {
                            [Op.like]: "%" + req.body.keyword + "%",
                        },
                    },
                ],
            };
        }

        options.where = {
            ...options.where,
            [Op.and]: [
                {
                    no_peserta: {
                        [Op.notLike]: "%fulan%",
                    }
                }
            ]
        };

        options.order = [
            ["flag", "desc"],
            ["ukt_tinggi", "asc"],
            ["id_cmahasiswa", "asc"],
        ];

        // Execute Query
        return db
            .transaction(function (t) {
                CMahasiswa.findAndCountAll(options).then((response) => {
                    let { rows, promises } = ukt.perCmahasiswa(response, true);
                    object.count = response.count;
                    object.rows = rows;
                    Promise.all(promises).then((values) => {
                        for (let i in values) {
                            object.rows[i].ukt = values[i].toJSON();
                            object.rows[i].ukt.nominal =
                                object.rows[i].golongan_id !== ""
                                    ? global.rupiah(values[i].toJSON().nominal)
                                    : "-";
                        }
                        let { rows, promises } = prodi.byCmahasiswa(object, false);
                        Promise.all(promises).then((values) => {
                            for (let i in values) {
                                object.rows[i].prodi = values[i];
                            }
                            res.status(200).json(object);
                        });
                    });
                });
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json(err);
            });
    }
);

router.get(
    "/count-flag",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        let object = {};
        return db
            .transaction(function (t) {
                CMahasiswa.findAll({
                    where: {
                        [Op.or]: [
                            {
                                flag: "selesai_isi",
                            },
                            {
                                flag: "pengumuman",
                            },
                            {
                                flag: "sanggah_ukt",
                            },
                            {
                                flag: "terima_ukt",
                            },
                            {
                                flag: "selesai_sanggah",
                            },
                        ],
                        no_peserta: { [Op.notLike]: "%fulan%" },
                        atribut: "original",
                    },

                    attributes: [[db.fn("COUNT", db.col("flag")), "selesai_isi"]],
                })
                    .then((response) => {
                        object.selesai_isi = response;
                        return CMahasiswa.findAll({
                            where: {
                                [Op.or]: [
                                    {
                                        flag: "belum_isi",
                                    },
                                    {
                                        flag: "pengisian",
                                    },
                                ],
                                no_peserta: { [Op.notLike]: "%fulan%" },
                                atribut: "original",
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "belum_isi"]],
                        });
                    })
                    .then((response) => {
                        object.belum_isi = response;
                        return CMahasiswa.findAll({
                            where: {
                                ukt_tinggi: "ya",
                                flag: "selesai_isi",
                                atribut: "original",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "ukt_tinggi"]],
                        });
                    })
                    .then((response) => {
                        object.ukt_tinggi = response;
                        return CMahasiswa.findAll({
                            where: {
                                ukt_tinggi: "tidak",
                                atribut: "original",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                            },
                            attributes: [
                                [db.fn("COUNT", db.col("flag")), "ukt_tinggi_tidak"],
                            ],
                        });
                    })
                    .then((response) => {
                        object.ukt_tinggi_tidak = response;
                        return CMahasiswa.findAll({
                            where: {
                                flag: "terima_ukt",
                                atribut: "original",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "terima_ukt"]],
                        });
                    })
                    .then((response) => {
                        object.terima_ukt = response;
                        return CMahasiswa.findAll({
                            where: {
                                flag: "pengumuman",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                                atribut: "original",
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "pengumuman"]],
                        });
                    })
                    .then((response) => {
                        object.pengumuman = response;
                        return CMahasiswa.findAll({
                            where: {
                                flag: "sanggah_ukt",
                                atribut: "sanggah",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "sanggah_ukt"]],
                        });
                    })
                    .then((response) => {
                        object.sanggah_ukt = response;
                        return CMahasiswa.findAll({
                            where: {
                                flag: "selesai_sanggah",
                                atribut: "sanggah",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "selesai_sanggah"]],
                        });
                    })
                    .then((response) => {
                        object.selesai_sanggah = response;
                        return CMahasiswa.findAll({
                            where: {
                                flag: "pengisian",
                                atribut: "original",
                                no_peserta: { [Op.notLike]: "%fulan%" },
                            },
                            attributes: [[db.fn("COUNT", db.col("flag")), "pengisian"]],
                        });
                    })
                    .then((response) => {
                        object.pengisian = response;
                        res.send(object);
                    });
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    }
);

router.get(
    "/flag-batal-klarifikasi/:no_peserta",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            return cmahasiswa
                .flagBatalKlarifikasi(req.params.no_peserta)
                .then(function (response) {
                    return cmahasiswa
                        .getCmahasiswa(req.params.no_peserta)
                        .then((response) => {
                            res.status(200).json(response);
                        })
                        .catch((err) => {
                            res.status(500).json("Gagal Mengambil Data");
                        });
                })
                .catch((err) => {
                    res.status(500).json("Gagal Memperbarui Flag");
                });
        });
    }
);

router.get(
    "/flag-selesai-klarifikasi/:no_peserta",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            ukt
                .computeUkt(req.params.no_peserta, "sanggah")
                .then((response) => {
                    /*return Info.findOne()
      }).then((info) => {
        return cmahasiswa.selesaiIsi(info, req.params.no_peserta)
      }).then((response) => {*/
                    return Value.findOne({
                        where: {
                            no_peserta: req.params.no_peserta,
                        },
                    });
                })
                .then((response) => {
                    return value.addLog(response, req.params.no_peserta, timestamp);
                })
                .then((response) => {
                    return cmahasiswa.addLog(response, req.params.no_peserta, timestamp);
                })
                .then((response) => {
                    return cmahasiswa
                        .flagSelesaiKlarifikasi(req.params.no_peserta)
                        .then(function (response) {
                            return cmahasiswa
                                .getCmahasiswa(req.params.no_peserta)
                                .then((response) => {
                                    res.status(200).json(response);
                                })
                                .catch((err) => {
                                    res.status(500).json("Gagal Mengambil Data");
                                });
                        })
                        .catch((err) => {
                            res.status(500).json("Gagal Memperbarui Flag");
                        });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json(err.statusText);
                });
        });
    }
);

router.get(
    "/just-compute/:no_peserta",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        ukt
            .justCompute(req.params.no_peserta, "sanggah")
            .then((response) => {
                res.send(response);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err.statusText);
            });
    }
);

router.post(
    "/datatable-sanggah",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        // Init requirements
        let perPage = parseInt(req.body.perPage, 10),
            object = {
                currentPage: req.body.page,
                perPage: perPage,
                keyword: req.body.keyword,
            };
        options = {
            limit: perPage,
            offset: (req.body.page - 1) * perPage,
            include: [{ model: Fakultas, as: "fakultas" }],
        };

        options.where = {
            [Op.or]: [
                {
                    flag: "sanggah_ukt",
                },
                {
                    flag: "selesai_sanggah",
                },
            ],
            atribut: "sanggah",
        };

        // Custom Query When Searching
        if (req.body.keyword !== "") {
            options.where[Op.or] = [
                {
                    no_peserta: {
                        [Op.like]: req.body.keyword + "%",
                    },
                },
                {
                    nama_cmahasiswa: {
                        [Op.like]: "%" + req.body.keyword + "%",
                    },
                },
                {
                    flag: {
                        [Op.like]: "%" + req.body.keyword + "%",
                    },
                },
            ];
        }

        // Execute Query
        return db
            .transaction(function (t) {
                CMahasiswa.findAndCountAll(options).then((response) => {
                    let { rows, promises } = ukt.perCmahasiswa(response, true);
                    object.count = response.count;
                    object.rows = rows;
                    Promise.all(promises).then((values) => {
                        for (let i in values) {
                            object.rows[i].ukt = values[i].toJSON();
                            object.rows[i].ukt.nominal =
                                object.rows[i].golongan_id !== ""
                                    ? global.rupiah(values[i].toJSON().nominal)
                                    : "-";
                        }
                        let { rows, promises } = prodi.byCmahasiswa(object, false);
                        Promise.all(promises).then((values) => {
                            for (let i in values) {
                                object.rows[i].prodi = values[i];
                            }
                            res.status(200).json(object);
                        });
                    });
                });
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json(err);
            });
    }
);

router.get(
    "/generate-tagihan",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return db.transaction(function (t) {
            CMahasiswa.findOne({
                where: {
                    no_peserta: req.user.no_peserta,
                },
            })
                .then((user) => {
                    if (user.tagihan == "") {
                        Info.findOne()
                            .then((info) => {
                                CMahasiswa.update(
                                    {
                                        tagihan: generateTagihan(info, req.user.no_peserta),
                                    },
                                    {
                                        where: {
                                            no_peserta: req.user.no_peserta,
                                        },
                                    }
                                ).then((res) => {
                                    res.status(200).json({ msg: "Tagihan berhasil dibuat" });
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json(err);
                            });
                    } else {
                        res.status(200).json({ msg: "Tagihan sudah ada" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json(err);
                });
        });
    }
);
module.exports = router;
