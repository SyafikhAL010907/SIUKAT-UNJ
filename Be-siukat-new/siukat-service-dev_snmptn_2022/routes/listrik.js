var express = require('express');
var router = express.Router();
var Listrik = require('../models/listrik');
var LogListrik = require('../models/log_listrik');
var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { listrik } = require('../services');
var multer  = require('multer')
var multerConf = require('../config/multer')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Listrik.findAll().then(users => {
      res.send(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    listrik.add(req.body, "original").then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.put('/edit', passport.authenticate('jwt', { session: false }), upload.single('file_scan_listrik'), function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Listrik.findOne({
      where: {
        no_peserta: req.user.no_peserta
      }
    }).then(users => {
      listrik.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        listrik.edit(req, no_peserta, 'original').then(function(response){
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

router.put('/edit/:no_peserta', passport.authenticate('jwt', { session: false }), upload.single('file_scan_listrik'), function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Listrik.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      listrik.addLog(users, 'sanggah', no_peserta, timestamp).then(function(response){
        listrik.edit(req, no_peserta, 'sanggah').then(function(response){
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

router.get('/get-listrik', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    listrik.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-listrik/:no_peserta', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Listrik.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Listrik.findOne({
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
