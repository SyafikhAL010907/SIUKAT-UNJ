var express = require("express");
var router = express.Router();
var Provinsi = require("../models/provinsi");
var BioProvinsi = require("../models/bio_ref_wilayah");
var db = require("../config/database");

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      Provinsi.findAll({
        order: ["provinsi_nama"],
      }).then((provinsi) => {
        res.send(provinsi);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      Provinsi.findById(req.params.id).then((provinsi) => {
        res.send(provinsi);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

// untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioProvinsi.findAll({
        where: {
          id_level: 1,
          id_negara: "ID",
          kode: {
            $not: "999999",
          },
        },
        order: ["nama"],
      }).then((provinsi) => {
        res.send(provinsi);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/bio/id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioProvinsi.findOne({
        where: {
          kode: req.params.id,
          id_level: 1,
          id_negara: "ID",
        },
      }).then((provinsi) => {
        res.send(provinsi);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
