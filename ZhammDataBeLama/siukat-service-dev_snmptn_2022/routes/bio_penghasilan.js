var express = require("express");
var router = express.Router();
var BioPenghasilan = require("../models/bio_ref_penghasilan");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioPenghasilan.findAll({
        // order: ['nama']
      }).then((penghasiilan) => {
        res.send(penghasiilan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
