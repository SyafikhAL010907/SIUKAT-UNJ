var express = require("express");
var router = express.Router();
var BioAgama = require("../models/bio_ref_agama");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioAgama.findAll({
        // order: ['nama']
      }).then((agama) => {
        res.send(agama);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
