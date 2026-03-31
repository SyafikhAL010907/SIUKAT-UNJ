var express = require("express");
var router = express.Router();
var BioOrtuCMahasiswa = require("../models/bio_ortu_cmahasiswa");
var Wilayah = require("../models/bio_ref_wilayah");
// var Kabkot = require('../models/kabkot')
// var Kecamatan = require('../models/kecamatan')
var Pekerjaan = require("../models/bio_ref_pekerjaan");
var Pendidikan = require("../models/bio_ref_pendidikan");
var Penghasilan = require("../models/bio_ref_penghasilan");
var Agama = require("../models/bio_ref_agama");
var Tinggal = require("../models/bio_ref_tinggal");
var Transportasi = require("../models/bio_ref_transportasi");

var moment = require("moment");
var db = require("../config/database");
var passport = require("passport");
var { bio_ortu_cmahasiswa } = require("../services");

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioOrtuCMahasiswa.findAll({
        include: [
          { model: Pendidikan, as: "detail_pendidikan_ayah" },
          { model: Pendidikan, as: "detail_pendidikan_ibu" },
          { model: Pendidikan, as: "detail_pendidikan_wali" },
          { model: Pekerjaan, as: "detail_pekerjaan_ayah" },
          { model: Pekerjaan, as: "detail_pekerjaan_ibu" },
          { model: Pekerjaan, as: "detail_pekerjaan_wali" },
          { model: Penghasilan, as: "detail_penghasilan_ayah" },
          { model: Penghasilan, as: "detail_penghasilan_ibu" },
          { model: Penghasilan, as: "detail_penghasilan_wali" },
          { model: Wilayah, as: "provinsi" },
          { model: Wilayah, as: "kabkot" },
          { model: Wilayah, as: "kecamatan" },
        ],
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
      bio_ortu_cmahasiswa
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
      BioOrtuCMahasiswa.findOne({
        where: {
          no_peserta: req.params.no_peserta,
        },
        include: [
          { model: Pendidikan, as: "detail_pendidikan_ayah" },
          { model: Pendidikan, as: "detail_pendidikan_ibu" },
          { model: Pendidikan, as: "detail_pendidikan_wali" },
          { model: Pekerjaan, as: "detail_pekerjaan_ayah" },
          { model: Pekerjaan, as: "detail_pekerjaan_ibu" },
          { model: Pekerjaan, as: "detail_pekerjaan_wali" },
          { model: Penghasilan, as: "detail_penghasilan_ayah" },
          { model: Penghasilan, as: "detail_penghasilan_ibu" },
          { model: Penghasilan, as: "detail_penghasilan_wali" },
          { model: Wilayah, as: "provinsi" },
          { model: Wilayah, as: "kabkot" },
          { model: Wilayah, as: "kecamatan" },
        ],
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
      BioOrtuCMahasiswa.findOne({
        where: {
          no_peserta: no_peserta,
        },
      }).then((users) => {
        bio_ortu_cmahasiswa
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

module.exports = router;
