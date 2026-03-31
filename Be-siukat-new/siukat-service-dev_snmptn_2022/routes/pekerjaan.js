var express = require("express");
var router = express.Router();
var Pekerjaan = require("../models/pekerjaan");
var BioPekerjaan = require("../models/bio_ref_pekerjaan");
var db = require("../config/database");

router.get("/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      Pekerjaan.findAll({
        // order: ['nama']
      }).then((pekerjaan) => {
        res.send(pekerjaan);
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
      BioPekerjaan.findAll({
        // order: ['nama']
      }).then((pekerjaan) => {
        res.send(pekerjaan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
