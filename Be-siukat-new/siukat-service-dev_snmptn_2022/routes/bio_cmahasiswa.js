var express = require("express");
var router = express.Router();
var BioCMahasiswa = require("../models/bio_cmahasiswa");
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
var {
  biocmahasiswa,
  bio_ortu_cmahasiswa,
  bio_sekolah_cmahasiswa,
} = require("../services");

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioCMahasiswa.findAll({
        include: [
          Agama,
          Tinggal,
          { model: Wilayah, as: "Provinsi" },
          { model: Wilayah, as: "Kabkot" },
          { model: Wilayah, as: "Kecamatan" },
          Transportasi,
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
      biocmahasiswa
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
      BioCMahasiswa.findOne({
        where: {
          no_peserta: req.params.no_peserta,
        },
        include: [
          Agama,
          Tinggal,
          { model: Wilayah, as: "Provinsi" },
          { model: Wilayah, as: "Kabkot" },
          { model: Wilayah, as: "Kecamatan" },
          Transportasi,
        ],
        // include: [Tinggal],
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
      BioCMahasiswa.findOne({
        where: {
          no_peserta: no_peserta,
        },
      }).then((users) => {
        // cmahasiswa.addLog(users, req.params.no_peserta, timestamp).then(function (response) {
        biocmahasiswa
          .edit(req, no_peserta)
          .then(function (response) {
            res.status(200).json(response);
          })
          .catch(function (err) {
            res.status(500).json(err);
          });
        // }).catch(function (err) {
        //   res.status(500).json(err)
        // })
        // biocmahasiswa
        //   .edit(req, no_peserta)
        //   .then(function (users) {
        //     res.status(200).json(users);
        //   })
        //   .catch(function (err) {
        //     console.log(err);
        //     res.status(500).json(err);
        //   });
      });
    })
    .catch(function (err) {
      if (err.message == "Query was empty") {
        console.log(
          "There is no changes in the update, lets continue the progress..."
        );
        // next();
      }
      res.status(500).json(err);
    });
});

router.get(
  "/verifikasi",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return db.transaction(function (t) {
      var obj = {};
      biocmahasiswa
        .getByLoggedIn(req.user.no_peserta)
        .then((response) => {
          obj.data = response;
          return biocmahasiswa.checkData(req.user.no_peserta);
        })
        .then((response) => {
          obj.biodataPribadi = response;
          return bio_ortu_cmahasiswa.checkData(req.user.no_peserta);
        })
        .then((response) => {
          obj.biodataOrtu = response;
          return bio_sekolah_cmahasiswa.checkData(
            req.user.no_peserta,
            obj.data
          );
        })
        .then((response) => {
          obj.biodataSekolah = response;
          obj.verifikasi =
            obj.biodataPribadi && obj.biodataOrtu && obj.biodataSekolah;
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
  "/selesai",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return db.transaction(function (t) {
      biocmahasiswa
        .selesaiIsi(req.user.no_peserta)
        .then((response) => {
          res.status(200).json("Data berhasil dikonfirmasi!");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err.statusText);
        });
    });
  }
);

module.exports = router;
