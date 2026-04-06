var express = require('express');
var router = express.Router();
var Keringanan = require('../models/keringanan');
var db = require('../config/database');
var passport = require('passport');
var { keringanan } = require('../services');
var multer = require('multer')
var multerConf = require('../config/multer')
var moment = require('moment');

var timestamp = moment().format().slice(0, 19).replace('T', ' ');

var upload = multer(multerConf)

router.get('/all', function (req, res, next) {
    return db.transaction(function (t) {
        Keringanan.findAll().then(users => {
            res.send(users)
        })
    }).catch(function (err) {
        res.status(500).json(err)
    })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    return db.transaction(function (t) {
        keringanan.add(req.body, "original").then(function (response) {
            res.json(response)
        }).catch(function (err) {
            res.status(500).json(err)
        })
    }).catch(function (err) {
        res.status(500).json(err)
    })
})

router.put('/edit',
    passport.authenticate('jwt', { session: false }),
    upload.single('file_scan_keringanan'),
    function (req, res, next) {
        return db.transaction(function (t) {
            var no_peserta = req.user.no_peserta
            Keringanan.findOne({
                where: {
                    no_peserta: no_peserta
                }
            }).then(users => {
                keringanan.addLog(users, 'original', req.user.no_peserta, timestamp).then(function (response) {
                    keringanan.edit(req, no_peserta, users, 'original').then(function (response) {
                        res.json(response)
                    }).catch(function (err) {
                        res.status(500).json(err)
                    })
                }).catch(function (err) {
                    res.status(500).json(err)
                })
            })
        }).catch(function (err) {
            res.status(500).json(err)
        })
    })

router.get('/get-keringanan', passport.authenticate('jwt', { session: false }), function (req, res) {
    return db.transaction(function (t) {
        keringanan.getByLoggedIn(req.user.no_peserta).then(function (response) {
            res.json(response)
        }).catch(function (err) {
            res.status(500).json(err)
        })
    })
})

router.get('/get-keringanan/:no_peserta', passport.authenticate('jwt', { session: false }), function (req, res) {
    return db.transaction(function (t) {
        Keringanan.findOne({
            where: {
                no_peserta: req.params.no_peserta,
                atribut: 'sanggah'
            }
        }).then(users => {
            if (users) {
                res.send(users)
            } else {
                return Keringanan.findOne({
                    where: {
                        no_peserta: req.params.no_peserta,
                        atribut: 'original'
                    }
                })
            }
        }).then(users => {
            if (users) {
                res.send(users)
            } else {
                res.send({ "msg": "data tidak ditemukan" })
            }
        })
    }).catch(function (err) {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router;
