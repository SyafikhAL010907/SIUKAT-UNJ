var express = require("express");
var router = express.Router();
var Kecamatan = require("../models/kecamatan");
var BioKecamatan = require("../models/bio_ref_wilayah");
var db = require("../config/database");

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      Kecamatan.findAll({
        order: ["kecam_nama"],
      }).then((kecamatan) => {
        res.send(kecamatan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      Kecamatan.findById(req.params.id).then((kecamatan) => {
        res.send(kecamatan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/kab_id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      Kecamatan.findAll({
        where: {
          kab_id: req.params.id,
        },
        order: ["kecam_nama"],
      }).then((kecamatan) => {
        res.send(kecamatan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

//untuk biodata
router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioKecamatan.findAll({
        where: {
          id_level: 3,
          id_negara: "ID",
        },
        order: ["nama"],
      }).then((kecamatan) => {
        res.send(kecamatan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/bio/id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioKecamatan.findOne({
        where: {
          kode: req.params.id,
        },
      }).then((kecamatan) => {
        res.send(kecamatan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/bio/kab_id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioKecamatan.findAll({
        where: {
          kode_induk: req.params.id,
          id_level: 3,
          id_negara: "ID",
        },
        order: ["nama"],
      }).then((kecamatan) => {
        res.send(kecamatan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
