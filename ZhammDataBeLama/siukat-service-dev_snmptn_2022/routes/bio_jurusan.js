var express = require("express");
var router = express.Router();
var BioJurusan = require("../models/bio_ref_jurusan");
var db = require("../config/database");

//untuk biodata

router.get("/bio/all", function (req, res, next) {
  return db
    .transaction(function (t) {
      BioJurusan.findAll({
        // order: ['nama']
      }).then((jurusan) => {
        res.send(jurusan);
      });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;
