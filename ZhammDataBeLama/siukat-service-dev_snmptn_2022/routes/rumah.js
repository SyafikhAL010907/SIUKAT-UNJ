var express = require('express');
var router = express.Router();
var Rumah = require('../models/rumah');
var User = require('./users.js');
var LogRumah = require('../models/log_rumah');
var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { rumah } = require('../services')
var multer  = require('multer')
var multerConf = require('../config/multer')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Rumah.findAll().then(users => {
      res.send(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    rumah.add(req.body, "original").then(function(response){
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
            { name: 'file_scan_pbb', maxCount: 1 },
            { name: 'file_scan_kontrak', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Rumah.findOne({
      where: {
        no_peserta: req.user.no_peserta
      }
    }).then(users => {
      rumah.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        rumah.edit(req, no_peserta, 'original').then(function(response){
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
            { name: 'file_scan_pbb', maxCount: 1 },
            { name: 'file_scan_kontrak', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Rumah.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      rumah.addLog(users, 'sanggah', req.params.no_peserta, timestamp).then(function(response){
        rumah.edit(req, no_peserta, 'sanggah').then(function(response){
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

router.get('/get-rumah', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    rumah.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-rumah/:no_peserta', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Rumah.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Rumah.findOne({
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
