var express = require('express');
var router = express.Router();
var Kendaraan = require('../models/kendaraan');
var LogKendaraan = require('../models/log_kendaraan');
var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { kendaraan } = require('../services');
var multer  = require('multer')
var multerConf = require('../config/multer')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Kendaraan.findAll().then(users => {
      res.send(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    kendaraan.add(req.body, "original").then(function(response){
      res.json(response)
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
            { name: 'file_scan_motor', maxCount: 1 },
            { name: 'file_scan_mobil', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Kendaraan.findOne({
      where: {
        no_peserta: no_peserta
      }
    }).then(users => {
      kendaraan.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        kendaraan.edit(req, no_peserta, users, 'original').then(function(response){
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

router.put('/edit/:no_peserta',
          passport.authenticate('jwt', { session: false }),
          upload.fields([
            { name: 'file_scan_motor', maxCount: 1 },
            { name: 'file_scan_mobil', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Kendaraan.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      kendaraan.addLog(users, 'sanggah', no_peserta, timestamp).then(function(response){
        kendaraan.edit(req, no_peserta, users, 'sanggah').then(function(response){
          res.json(response)
        }).catch(function(err){
		  console.log(err)
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

router.get('/get-kendaraan', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    kendaraan.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-kendaraan/:no_peserta', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Kendaraan.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Kendaraan.findOne({
			where: {
				no_peserta: req.params.no_peserta,
				atribut: 'original'
			}
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
