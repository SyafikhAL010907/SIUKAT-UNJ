var express = require("express");
var router = express.Router();
var BioPendidikan = require("../models/bio_ref_pendidikan");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioPendidikan.findAll({
        // order: ['nama']
      }).then((pendidikan) => {
        res.send(pendidikan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
