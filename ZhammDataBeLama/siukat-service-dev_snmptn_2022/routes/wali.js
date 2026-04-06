var express = require('express');
var router = express.Router();
var Wali = require('../models/wali');
var LogWali = require('../models/log_wali');
var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { wali } = require('../services');
var multer  = require('multer')
var multerConf = require('../config/multer')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Wali.findAll().then(users => {
      res.send(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.get('/id/:id', function(req, res, next){
  return db.transaction(function (t) {
    Wali.findById({
		where: {
			no_peserta: req.params.id,
			atribut: 'sanggah'
		}
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Wali.findById({
			where: {
				no_peserta: req.params.id,
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
    res.status(500).json(err)
  })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    wali.add(req.body, "original").then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.put('/edit', passport.authenticate('jwt', { session: false }), upload.single('file_scan_wali'), function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Wali.findOne({
      where: {
        no_peserta: req.user.no_peserta
      }
    }).then(users => {
      wali.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        wali.edit(req, no_peserta, 'original').then(function(response){
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

router.put('/edit/:no_peserta', passport.authenticate('jwt', { session: false }), upload.single('file_scan_wali'), function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Wali.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      wali.addLog(users, 'sanggah', req.params.no_peserta, timestamp).then(function(response){
        wali.edit(req, no_peserta, 'sanggah').then(function(response){
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

router.get('/get-wali', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    wali.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-wali/:no_peserta', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Wali.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Wali.findOne({
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
