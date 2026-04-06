var express = require("express");
var router = express.Router();
var BioTransportasi = require("../models/bio_ref_transportasi");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioTransportasi.findAll({
        // order: ['nama']
      }).then((transportasi) => {
        res.send(transportasi);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
