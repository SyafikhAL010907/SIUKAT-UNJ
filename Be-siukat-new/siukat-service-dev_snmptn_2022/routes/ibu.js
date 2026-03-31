var express = require('express');
var router = express.Router();
var Ibu = require('../models/ibu');
var LogIbu = require('../models/log_ibu');
var moment = require('moment');
var db = require('../config/database');
var passport = require('passport');
var { ibu } = require('../services');
var multer  = require('multer')
var multerConf = require('../config/multer')
var Provinsi = require('../models/provinsi')
var Kabkot = require('../models/kabkot')
var Kecamatan = require('../models/kecamatan')
var Pekerjaan = require('../models/pekerjaan')

var timestamp = moment().format().slice(0,19).replace('T',' ');

var upload = multer(multerConf)

router.get('/all', function(req, res, next){
  return db.transaction(function (t) {
    Ibu.findAll().then(users => {
      res.send(users)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
});

router.post('/add', passport.authenticate('jwt', { session: false }), function(req, res, next){
  return db.transaction(function (t) {
    ibu.add(req.body, "original").then(function(response){
      res.json(response)
    }).catch(function (err) {
      res.status(500).json(err)
    })
  })
});

router.put('/edit',
            passport.authenticate('jwt', { session: false }),
            upload.fields([
              { name: 'file_scan_ktp_ibu', maxCount: 1 },
              { name: 'file_scan_slip_ibu', maxCount: 1 }
            ]),
            function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.user.no_peserta
    Ibu.findOne({
      where: {
        no_peserta: no_peserta
      }
    }).then(users => {
      ibu.addLog(users, 'original', req.user.no_peserta, timestamp).then(function(response){
        ibu.edit(req, no_peserta, 'original').then(function(response){
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
              { name: 'file_scan_ktp_ibu', maxCount: 1 },
              { name: 'file_scan_slip_ibu', maxCount: 1 }
            ]),
            function(req, res, next){
  return db.transaction(function (t) {
    var no_peserta = req.params.no_peserta
    Ibu.findOne({
      where: {
        no_peserta: no_peserta,
		atribut: 'sanggah'
      }
    }).then(users => {
      ibu.addLog(users, 'sanggah', req.params.no_peserta, timestamp).then(function(response){
        ibu.edit(req, no_peserta, 'sanggah').then(function(response){
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

router.get('/get-ibu', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    ibu.getByLoggedIn(req.user.no_peserta).then(function(response){
      res.json(response)
    }).catch(function(err){
      res.status(500).json(err)
    })
  })
})

router.get('/get-ibu/:no_peserta', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Ibu.findOne({
		where: {
			no_peserta: req.params.no_peserta,
			atribut: 'sanggah'
		}, include: [Provinsi, Kabkot, Kecamatan, Pekerjaan]
	}).then(users => {
      if(users){
        res.send(users)
      }else{
		return Ibu.findOne({
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
