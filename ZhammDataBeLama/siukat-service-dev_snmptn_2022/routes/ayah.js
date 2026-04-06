var express = require('express');
var router = express.Router();
var Ayah = require('../models/ayah');
var LogAyah = require('../models/log_ayah');
var Provinsi = require('../models/provinsi')
var Kabkot = require('../models/kabkot')
var Kecamatan = require('../models/kecamatan')
var Pekerjaan = require('../models/pekerjaan')

var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { ayah } = require('../services');
var multer  = require('multer')
var multerConf = require('../config/multer')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Ayah.findAll().then(users => {
      res.status(200).json(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/id/:id', function(req, res, next){
  return db.transaction(function (t) {
    Ayah.findById(req.params.id).then(users => {
      if(users){
        res.status(200).json(users)
      }else{
        res.status(500).json("data tidak ditemukan")
      }
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    ayah.add(req.body, "original").then(function(response){
      res.status(200).json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.put('/edit',
          passport.authenticate('jwt', { session: false }),
          upload.fields([
            { name: 'file_scan_ktp_ayah', maxCount: 1 },
            { name: 'file_scan_slip_ayah', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Ayah.findOne({
      where: {
        no_peserta: no_peserta
      }
    }).then(users => {
      ayah.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        ayah.edit(req, no_peserta, 'original').then(function(response){
          res.status(200).json(response)
        }).catch(function(err){
          res.status(500).json(err)
        })
      }).catch(function(err){
        res.status(500).json(err)
      })
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.put('/edit/:no_peserta',
          passport.authenticate('jwt', { session: false }),
          upload.fields([
            { name: 'file_scan_ktp_ayah', maxCount: 1 },
            { name: 'file_scan_slip_ayah', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Ayah.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      ayah.addLog(users, 'sanggah', req.params.no_peserta, timestamp).then(function(response){
        ayah.edit(req, no_peserta, 'sanggah').then(function(response){
          res.json(response)
        }).catch(function(err){
          res.status(500).json(err)
        })
      }).catch(function(err){
        res.status(500).json(err)
      })
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/get-ayah', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    ayah.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.status(200).json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-ayah/:no_peserta', function(req, res, next){
  return db.transaction(function (t) {
    Ayah.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}, include: [Provinsi, Kabkot, Kecamatan, Pekerjaan]
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Ayah.findOne({
			where: {
				no_peserta: req.params.no_peserta,
				atribut: 'original'
			}, include: [Provinsi, Kabkot, Kecamatan, Pekerjaan]
		})
      }
    }).then(users => {
      if(users){
        res.send(users)
      }else{
        res.send({"msg": "data tidak ditemukan"})
	  }
	})
  }).catch(function (err) {
	  console.log(err)
    res.status(500).json(err)
  })
})

module.exports = router;
