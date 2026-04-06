var Pendukung = require('../models/pendukung');
var LogPendukung = require('../models/log_pendukung');

var pendukung = function () {};

pendukung.prototype.add = function(req, atribut){
  return new Promise(function(resolve, reject){
    Pendukung.create({
      no_peserta: req.no_peserta,
      tanggungan: req.tanggungan,
      scan_pernyataan_ukt_tinggi: req.scan_pernyataan_ukt_tinggi,
      scan_pernyataan_kebenaran: req.scan_pernyataan_kebenaran,
      scan_kk: req.scan_kk,
      atribut: atribut
    }, {
      fields: [
        'no_peserta',
        'tanggungan',
        'scan_pernyataan_ukt_tinggi',
        'scan_pernyataan_kebenaran',
        'scan_kk',
        'atribut'
      ]
    }).then(function(response){
      resolve(response)
    }).catch(function(err){
      reject(err)
    })
  })
}

pendukung.prototype.edit = function(req, no_peserta, atribut){
  return new Promise(function(resolve, reject){
    var data = {
      tanggungan: req.body.tanggungan,
    }

    if(req.files["file_scan_pernyataan_ukt_tinggi"] !== undefined){
      data.scan_pernyataan_ukt_tinggi = req.files["file_scan_pernyataan_ukt_tinggi"][0].filename
    }
    if(req.files["file_scan_pernyataan_kebenaran"] !== undefined){
      data.scan_pernyataan_kebenaran = req.files["file_scan_pernyataan_kebenaran"][0].filename
    }
    if(req.files["file_scan_kk"] !== undefined){
      data.scan_kk = req.files["file_scan_kk"][0].filename
    }

    Pendukung.update(data, {
      where: {
        no_peserta: no_peserta,
		atribut: atribut
      }
    }).then(function(response){
      resolve(response)
    }).catch(function(err){
      reject(err)
    })
  })
}

pendukung.prototype.addLog = function(users, atribut, executor, timestamp){
  return new Promise(function(resolve, reject){
    LogPendukung.create({
      no_peserta: users.no_peserta,
      tanggungan: users.tanggungan,
      scan_pernyataan_ukt_tinggi: users.scan_pernyataan_ukt_tinggi,
      scan_pernyataan_kebenaran: users.scan_pernyataan_kebenaran,
      scan_kk: users.scan_kk,
      atribut: atribut,
      executor: executor,
      timestamp: timestamp
    }, {
      field: [
        'no_peserta',
        'tanggungan',
        'scan_pernyataan_ukt_tinggi',
        'scan_pernyataan_kebenaran',
        'scan_kk',
        'atribut',
        'executor',
        'timestamp'
      ]
    }).then(function(response){
      resolve(response)
    }).catch(function(err){
      reject(err)
    })
  })
}

pendukung.prototype.getByLoggedIn = function(no_peserta){
  return new Promise(function(resolve, reject){
    Pendukung.findOne({
      where: {
        no_peserta: no_peserta
      }
    }).then(function(response){
      resolve(response)
    }).catch(function(err){
      reject(err)
    })
  })
}

pendukung.prototype.checkData = function(no_peserta, users){
  return new Promise((resolve, reject) => {
    Pendukung.findOne({
      where: {
        no_peserta: no_peserta
      },
      raw: true,
    }).then(function (response){
      var result = true
      var data = {}
      if(users.ukt_tinggi === "ya"){
        data.scan_pernyataan_ukt_tinggi = response.scan_pernyataan_ukt_tinggi
      }else{
        delete response.scan_pernyataan_ukt_tinggi
        delete response.scan_pernyataan_kebenaran
        data = response
      }
      for(var key in data){
        result *= (data[key] !== 0 && data[key] !== "")
      }
      resolve(result)
    }).catch(function (err) {
      reject(err)
    })
  })
}

pendukung.prototype.checkDataVerifikasi = function(no_peserta, users){
  return new Promise((resolve, reject) => {
    Pendukung.findOne({
      where: {
        no_peserta: no_peserta
      },
      raw: true,
    }).then(function (response){
      var result = true
      var data = {}
      if(users.ukt_tinggi === "ya"){
        data.scan_pernyataan_ukt_tinggi = response.scan_pernyataan_ukt_tinggi
      }else{
        data.scan_pernyataan_kebenaran = response.scan_pernyataan_kebenaran
      }
      for(var key in data){
        result *= (data[key] !== 0 && data[key] !== "")
      }
      resolve(result)
    }).catch(function (err) {
      reject(err)
    })
  })
}

module.exports = pendukung
