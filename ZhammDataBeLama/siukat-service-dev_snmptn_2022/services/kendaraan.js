var Kendaraan = require('../models/kendaraan');
var LogKendaraan = require('../models/log_kendaraan');

var kendaraan = function () {};

kendaraan.prototype.add = function(req, atribut){
  return new Promise(function(resolve, reject){
    Kendaraan.create({
      no_peserta: req.no_peserta,
      status_motor: req.status_motor,
      jumlah_motor: req.jumlah_motor,
      pajak_motor: req.pajak_motor,
      scan_motor: req.scan_motor,
      status_mobil: req.status_mobil,
      jumlah_mobil: req.jumlah_mobil,
      pajak_mobil: req.pajak_mobil,
      scan_mobil: req.scan_mobil,
      atribut: atribut
    },{
      fields: [
        'no_peserta',
        'status_motor',
        'jumlah_motor',
        'pajak_motor',
        'scan_motor',
        'status_mobil',
        'jumlah_mobil',
        'pajak_mobil',
        'scan_mobil',
        'atribut'
      ]
    }).then(function(response){
      resolve(response)
    }).catch(function(err){
      reject(err)
    })
  })
}

kendaraan.prototype.edit = function(req, no_peserta, users, atribut){
  return new Promise(function(resolve, reject){
    var data = {
      status_motor: req.body.status_motor,
      jumlah_motor: (req.body.status_motor=="tidak")? "":req.body.jumlah_motor,
      pajak_motor: (req.body.status_motor=="tidak")? "":req.body.pajak_motor,
      scan_motor: users.scan_motor,
      status_mobil: req.body.status_mobil,
      jumlah_mobil: (req.body.status_mobil=="tidak")? "":req.body.jumlah_mobil,
      pajak_mobil: (req.body.status_mobil=="tidak")? "":req.body.pajak_mobil,
      scan_mobil: users.scan_mobil,
    }

    if(req.files["file_scan_motor"] !== undefined){
      data.scan_motor = (req.body.status_motor=="tidak")? "":req.files["file_scan_motor"][0].filename
    }else{
      data.scan_motor = (req.body.status_motor=="tidak")? "":users.scan_motor      
    }
    if(req.files["file_scan_mobil"] !== undefined){
      data.scan_mobil = (req.body.status_mobil=="tidak")? "":req.files["file_scan_mobil"][0].filename
    }else{
      data.scan_mobil = (req.body.status_mobil=="tidak")? "":users.scan_mobil
    }
    Kendaraan.update(data, {
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

kendaraan.prototype.addLog = function(users, atribut, executor, timestamp){
  return new Promise(function(resolve, reject){
    LogKendaraan.create({
      no_peserta: users.no_peserta,
      status_motor: users.status_motor,
      jumlah_motor: users.jumlah_motor,
      pajak_motor: users.pajak_motor,
      scan_motor: users.scan_motor,
      status_mobil: users.status_mobil,
      jumlah_mobil: users.jumlah_mobil,
      pajak_mobil: users.pajak_mobil,
      scan_mobil: users.scan_mobil,
      atribut: atribut,
      executor: executor,
      timestamp: timestamp
    }, {
      field: [
        'no_peserta',
        'status_motor',
        'jumlah_motor',
        'pajak_motor',
        'scan_motor',
        'status_mobil',
        'jumlah_mobil',
        'pajak_mobil',
        'scan_mobil',
        'atribut',
        'executor',
        'atribut'
      ]
    }).then(function(response){
      resolve(response)
    }).catch(function(err){
      reject(err)
    })
  })
}

kendaraan.prototype.getByLoggedIn = function(no_peserta){
  return new Promise(function(resolve, reject){
    Kendaraan.findOne({
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

kendaraan.prototype.checkData = function(no_peserta){
  return new Promise((resolve, reject) => {
    Kendaraan.findOne({
      where: {
        no_peserta: no_peserta
      },
      raw: true,
    }).then(function (response){
      var result = true
      if(response.status_motor==="tidak"){
        delete response.jumlah_motor
        delete response.pajak_motor
        delete response.scan_motor
      }

      if(response.status_mobil==="tidak"){
        delete response.jumlah_mobil
        delete response.pajak_mobil
        delete response.scan_mobil
      }

      for(var key in response){
        result *= (response[key] !== 0 && response[key] !== "")
      }
      resolve(result)
    }).catch(function (err) {
      reject(err)
    })
  })
}

module.exports = kendaraan
