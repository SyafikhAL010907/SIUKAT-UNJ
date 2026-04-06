var express = require("express");
var router = express.Router();
var RefSekolah = require("../models/data_sekolah");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      RefSekolah.findAll({
        // order: ['nama']
      }).then((value) => {
        res.send(value);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
