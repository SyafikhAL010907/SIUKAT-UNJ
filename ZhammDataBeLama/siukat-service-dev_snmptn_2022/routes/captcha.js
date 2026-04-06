var express = require('express');
var router = express.Router();
var Captcha = require('../models/captcha');
var db = require('../config/database');

router.get('/', function(req, res, next){
  return db.transaction(function (t) {
    Captcha.findOne({
      order: [
        db.fn( 'RAND' ),
      ]
    }).then(captcha => {
      res.status(200).json(captcha)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

module.exports = router;
