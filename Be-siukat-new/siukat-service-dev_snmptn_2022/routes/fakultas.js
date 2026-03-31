var express = require('express');
var router = express.Router();
var Fakultas = require('../models/fakultas');
var db = require('../config/database');

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Fakultas.findAll().then(fakultas => {
      res.send(fakultas)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/id/:id', function(req, res, next){
  return db.transaction(function (t) {
    Fakultas.findById(req.params.id).then(fakultas => {
      if(fakultas){
        res.send(fakultas)
      }else{
        res.send({"msg": "data tidak ditemukan"})
      }
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

module.exports = router;
