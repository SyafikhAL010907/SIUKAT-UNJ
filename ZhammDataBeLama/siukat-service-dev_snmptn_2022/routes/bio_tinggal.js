var express = require("express");
var router = express.Router();
var BioTinggal = require("../models/bio_ref_tinggal");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioTinggal.findAll({
        // order: ['nama']
      }).then((tinggal) => {
        res.send(tinggal);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
