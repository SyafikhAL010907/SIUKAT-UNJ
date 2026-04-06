var express = require('express');
var router = express.Router();
var db = require('../config/database');
var path = require('path');
var passport = require('passport');
var { cmahasiswa, ayah, ibu, rumah, listrik, wali, kendaraan, pendukung, users } = require('../services')
var moment = require('moment')
var CMahasiswa = require('../models/cmahasiswa');
var Info = require('../models/info')
var Ukt = require('../models/ukt')
var global = require('../global')

var fs = require('fs');
var ejs = require('ejs');
var pdf = require('html-pdf')

router.get('/slip-kocak', function (req, res, next) {
  // Check Tagihan dulu
  const tagihan = "9219013497";
  cmahasiswa.cekTagihan(tagihan).then(rs => {
    // Generate PDF nya
    var obj = {}
    Info.findOne().then(function (response) {
      response.pembayaran = "14 Mei 2019 - 16 Agustus 2019"
      obj.info = response
      return users.getUser(tagihan)
    }).then(function (response) {
      obj.cmahasiswa = response
      return Ukt.findOne({
        where: {
          major_id: response.prodi_cmahasiswa
        },
        attributes: [response.golongan_id]
      })
    }).then(function (response) {
      obj.ukt = response
      var compiled = ejs.compile(fs.readFileSync('views/pdf/slip-pembayaran.html', 'utf8'))
      var html = compiled(obj)
      var options = { format: 'A4' }
      pdf.create(html, options).toStream(function (err, stream) {
        stream.pipe(res);
      });
    }).catch(function (err) {
      res.status(500).json(err)
    })
  }).catch(err => {
    res.status(500).json(err)
  })
})

router.get('/slip-pembayaran', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  // Check Tagihan dulu
  cmahasiswa.cekTagihan(req.user.no_peserta).then(rs => {
    // Generate PDF nya
    var obj = {}
    Info.findOne().then(function (response) {
      obj.info = response
      return users.getUser(req.user.no_peserta)
    }).then(function (response) {
      obj.cmahasiswa = response
      return Ukt.findOne({
        where: {
          major_id: response.prodi_cmahasiswa
        },
        attributes: [response.golongan_id]
      })
    }).then(function (response) {
      obj.ukt = response
      var compiled = ejs.compile(fs.readFileSync('views/pdf/slip-pembayaran.html', 'utf8'))
      var html = compiled(obj)
      var options = { format: 'A4' }
      pdf.create(html, options).toStream(function (err, stream) {
        stream.pipe(res);
      });
    }).catch(function (err) {
      res.status(500).json(err)
    })
  }).catch(err => {
    res.status(500).json(err)
  })
})

router.get('/bukti-selesai', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var obj = {}
  Info.findOne().then(function (response) {
    obj.info = response
    return users.getUser(req.user.no_peserta)
  }).then(function (response) {
    obj.cmahasiswa = response
    var compiled = ejs.compile(fs.readFileSync('views/pdf/bukti-selesai.html', 'utf8'))
    var html = compiled(obj)
    var options = { format: 'A4', base: "file:///Applications/XAMPP/htdocs/siukat-service/public/" }
    pdf.create(html, options).toStream(function (err, stream) {
      stream.pipe(res);
    });
    // .toFile('./result.pdf',() => {
    //     res.pdf('./result.pdf')
    // })
  }).catch(function (err) {
    res.json(err)
  })
})

router.get('/surat-validasi', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var obj = {
    tahun: moment().format('YYYY')
  }

  users.getUser(req.user.no_peserta).then((response) => {
    obj.cmahasiswa = response
    return ayah.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.ayah = response
    return ibu.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.ibu = response
    return kendaraan.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.kendaraan = response
    return wali.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.wali = response
    return rumah.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.rumah = response
    return listrik.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.listrik = response
    return pendukung.getByLoggedIn(req.user.no_peserta)
  }).then((response) => {
    obj.pendukung = response
    var compiled = ejs.compile(fs.readFileSync('views/pdf/surat-validasi.html', 'utf8'))
    var html = compiled(obj)
    var options = {
      format: 'A4',
      base: "file:///Applications/XAMPP/htdocs/siukat-service/public/",
    }
    pdf.create(html, options).toStream(function (err, stream) {
      stream.pipe(res);
    });
  }).catch(function (err) {
    res.json(err)
  })
})

router.get('/sanggah', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  cmahasiswa.getSanggah().then(function (response) {
    var response = {
      rows: response
    }

    var compiled = ejs.compile(fs.readFileSync('views/pdf/pdf-sanggah.html', 'utf8'))
    var html = compiled(response, options)
    var options = { format: 'A4', orientation: 'landscape', base: "file:///F:/xampp/htdocs/siukat-service/public/" }
    pdf.create(html, options).toStream(function (err, stream) {
      stream.pipe(res);
    });
  }).catch(function (err) {
    res.json(err)
  })
})

router.get('/bm', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  cmahasiswa.getBM().then(function (response) {
    response = {
      rows: response
    }

    var compiled = ejs.compile(fs.readFileSync('views/pdf/pdf-bm.html', 'utf8'))
    var html = compiled(response)
    var options = { format: 'A4', orientation: 'landscape', base: "file:///F:/xampp/htdocs/siukat-service/public/" }
    console.log(html)
    pdf.create(html, options).toStream(function (err, stream) {
      stream.pipe(res);
    });
  }).catch(function (err) {
    res.json(err)
  })
})

router.get('/kontrak', function (req, res, next) {
  var obj = {
    tahun: moment().format('YYYY')
  }

  var compiled = ejs.compile(fs.readFileSync('views/pdf/kontrak.html', 'utf8'))
  var html = compiled(obj)

  pdf.create(html).toStream(function (err, stream) {
    stream.pipe(res);
  });

  /*pdf.create(html).toBuffer(function(err, buffer){
    res.send(buffer)
  });*/
})

router.get('/wali', function (req, res, next) {
  res.pdf(path.resolve('views/pdf/contoh/SURAT_PERNYATAAN_WALI_CALON_MAHASISWA.pdf'))
})

router.get('/alur', function (req, res, next) {
  var obj = {
    tahun: moment().format('YYYY')
  }

  var compiled = ejs.compile(fs.readFileSync('views/pdf/alur.html', 'utf8'))
  var html = compiled(obj)
  pdf.create(html).toStream(function (err, stream) {
    stream.pipe(res);
  });
})

router.get('/surat-pernyataan-ukt-atas', function (req, res, next) {
  res.pdf(path.resolve('views/pdf/contoh/SURAT_PERNYATAAN_UKT_TERTINGGI.pdf'))
})

router.get('/tidak-sanggup', function (req, res, next) {
  res.pdf(path.resolve('views/pdf/contoh/FORM_KETIDAKSANGGUPAN_UKT.pdf'))
})

router.get('/pengumuman-snmptn', (req, res, next) => {
  const year = new Date().getFullYear();
  res.pdf(path.resolve('public/pdf/Pengumuman_Kelulusan_SNMPTN_' + year + '.pdf'))
})

router.get('/pengumuman-sbmptn', (req, res, next) => {
  const year = new Date().getFullYear();
  res.pdf(path.resolve('public/pdf/Pengumuman_Kelulusan_SBMPTN_' + year + '.pdf'))
})

router.get('/pengumuman-japres', (req, res, next) => {
  const year = new Date().getFullYear();
  res.pdf(path.resolve('public/pdf/Pengumuman_Kelulusan_JAPRES_' + year + '.pdf'))
})

router.get('/pengumuman-mandiri', (req, res, next) => {
  const year = new Date().getFullYear();
  res.pdf(path.resolve('public/pdf/Pengumuman_Kelulusan_MANDIRI_' + year + '.pdf'))
})

module.exports = router;
