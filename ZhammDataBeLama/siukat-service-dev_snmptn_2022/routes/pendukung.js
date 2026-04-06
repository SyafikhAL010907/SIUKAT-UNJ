var express = require('express');
var router = express.Router();
var Pendukung = require('../models/pendukung');
var LogPendukung = require('../models/log_pendukung');
var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { pendukung } = require('../services');
var multer  = require('multer')
var multerConf = require('../config/multer')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Pendukung.findAll().then(users => {
      res.send(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/id/:id', function(req, res, next){
  return db.transaction(function (t) {
    Pendukung.findById(req.params.id).then(users => {
      if(users){
        res.send(users)
      }else{
        res.send({"msg": "data tidak ditemukan"})
      }
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    pendukung.add(req.body, "original").then(function(response){
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
            { name: 'file_scan_pernyataan_ukt_tinggi', maxCount: 1 },
            { name: 'file_scan_pernyataan_kebenaran', maxCount: 1 },
            { name: 'file_scan_kk', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Pendukung.findOne({
      where: {
        no_peserta: req.user.no_peserta
      }
    }).then(users => {
      pendukung.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        pendukung.edit(req, no_peserta, 'original').then(function(response){
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
            { name: 'file_scan_pernyataan_ukt_tinggi', maxCount: 1 },
            { name: 'file_scan_pernyataan_kebenaran', maxCount: 1 },
            { name: 'file_scan_kk', maxCount: 1 }
          ]),
          function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Pendukung.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      pendukung.addLog(users, 'sanggah', no_peserta, timestamp).then(function(response){
        pendukung.edit(req, no_peserta, 'sanggah').then(function(response){
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

router.get('/get-pendukung', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    pendukung.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-pendukung/:no_peserta', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Pendukung.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Pendukung.findOne({
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
