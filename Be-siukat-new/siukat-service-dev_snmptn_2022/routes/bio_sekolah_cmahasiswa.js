var express = require("express");
var router = express.Router();
var BioSekolahCMahasiswa = require("../models/bio_sekolah_cmahasiswa");
var Wilayah = require("../models/bio_ref_wilayah");
// var Kabkot = require('../models/kabkot')
// var Kecamatan = require('../models/kecamatan')
var Pekerjaan = require("../models/bio_ref_pekerjaan");
var Pendidikan = require("../models/bio_ref_pendidikan");
var Penghasilan = require("../models/bio_ref_penghasilan");
var Agama = require("../models/bio_ref_agama");
var Tinggal = require("../models/bio_ref_tinggal");
var Transportasi = require("../models/bio_ref_transportasi");
var Jurusan = require("../models/bio_ref_jurusan");
var DataSekolah = require("../models/data_sekolah");

var moment = require("moment");
var db = require("../config/database");
var passport = require("passport");
var { bio_sekolah_cmahasiswa } = require("../services");

var multer = require("multer");
var multerConf = require("../config/multer");

var timestamp = moment().format().slice(0, 19).replace("T", " ");

var upload = multer(multerConf);

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioSekolahCMahasiswa.findAll({
        include: [DataSekolah, Jurusan],
      }).then((users) => {
        res.status(200).json(users);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return db.transaction(function (t) {
      bio_sekolah_cmahasiswa
        .getByLoggedIn(req.user.no_peserta)
        .then(function (response) {
          res.status(200).json(response);
        })
        .catch(function (err) {
          res.status(500).json(err);
        });
    });
  }
);

router.get("/no-peserta/:no_peserta", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioSekolahCMahasiswa.findOne({
        where: {
          no_peserta: req.params.no_peserta,
        },
        include: [DataSekolah, Jurusan],
      }).then((users) => {
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
});

router.put("/edit", passport.authenticate("jwt", { session: false }), function (
  req,
  res,
  next
) {
  return db
    .transaction(function (t) {
      var no_peserta = req.user.no_peserta;
      BioSekolahCMahasiswa.findOne({
        where: {
          no_peserta: no_peserta,
        },
      }).then((users) => {
        bio_sekolah_cmahasiswa
          .edit(req, no_peserta)
          .then(function (users) {
            res.status(200).json(users);
          })
          .catch(function (err) {
            res.status(500).json(err);
          });
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  upload.fields([{ name: "file_scan_skl_ijazah", maxCount: 1 }]),
  function (req, res, next) {
    return db
      .transaction(function (t) {
        var no_peserta = req.user.no_peserta;
        BioSekolahCMahasiswa.findOne({
          where: {
            no_peserta: no_peserta,
          },
        }).then((users) => {
          bio_sekolah_cmahasiswa
            .update(req, no_peserta)
            .then(function (users) {
              res.status(200).json(users);
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

module.exports = router;
