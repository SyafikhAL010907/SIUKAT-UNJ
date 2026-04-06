var express = require("express");
var router = express.Router();
var Kabkot = require("../models/kabkot");
var BioKabkot = require("../models/bio_ref_wilayah");
var db = require("../config/database");

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      Kabkot.findAll({
        order: ["kab_nama"],
      }).then((kabkot) => {
        res.send(kabkot);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      Kabkot.findById(req.params.id).then((kabkot) => {
        res.send(kabkot);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/provinsi_id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      Kabkot.findAll({
        where: {
          provinsi_id: req.params.id,
        },
        order: ["kab_nama"],
      }).then((kabkot) => {
        res.send(kabkot);
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
      BioKabkot.findAll({
        where: {
          id_level: 2,
          id_negara: "ID",
        },
        order: ["nama"],
      }).then((bio_kabkot) => {
        res.send(bio_kabkot);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/bio/id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioKabkot.findOne({
        where: {
          kode: req.params.id,
        },
      }).then((bio_kabkot) => {
        res.send(bio_kabkot);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

router.get("/bio/provinsi_id/:id", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioKabkot.findAll({
        where: {
          kode_induk: req.params.id,
          id_level: 2,
          id_negara: "ID",
        },
        order: ["nama"],
      }).then((bio_kabkot) => {
        res.send(bio_kabkot);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
