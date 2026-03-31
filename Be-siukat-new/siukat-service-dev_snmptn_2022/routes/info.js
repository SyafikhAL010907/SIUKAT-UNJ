var express = require('express');
var router = express.Router();
var db = require('../config/database');
var Info = require('../models/info');

router.get('/', function (req, res) {
  return db.transaction(function (t) {
    Info.findOne().then(info => {
      res.send(info)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.put('/save', function (req, res) {
  return db.transaction(function (t) {
    Info.update(req.body, { where: { kode: 1 } })
      .then(info => {
        res.json(info)
      }).catch(function (err) {
        res.status(500).json(err)
      })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

module.exports = router;
