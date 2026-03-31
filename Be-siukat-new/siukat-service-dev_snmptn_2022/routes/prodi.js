var express = require('express');
var router = express.Router();
var Prodi = require('../models/prodi');
var db = require('../config/database');

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Prodi.findAll().then(prodi => {
      res.send(prodi)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/id/:id', function(req, res, next){
  return db.transaction(function (t) {
    Prodi.findById(req.params.id).then(prodi => {
      res.send(prodi)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/fakultas/:kode_fak', function(req, res, next){
  return db.transaction(function (t) {
    Prodi.findAll({
      where:{
        kode_fak: req.params.kode_fak
      }
    }).then(prodi => {
      res.send(prodi)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

module.exports = router;
