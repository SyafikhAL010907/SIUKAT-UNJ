var Keringanan = require('../models/keringanan');
var LogKeringanan = require('../models/log_keringanan');

var keringanan = function () { };

keringanan.prototype.add = function (req, atribut) {
    return new Promise(function (resolve, reject) {
        Keringanan.create({
            no_peserta: req.no_peserta,
            scan_keringanan: req.scan_keringanan,
            flag: req.flag,
            atribut: atribut
        }, {
            fields: [
                'no_peserta',
                'scan_keringanan',
                'flag',
                'atribut'
            ]
        }).then(function (response) {
            resolve(response)
        }).catch(function (err) {
            reject(err)
        })
    })
}

keringanan.prototype.edit = function (req, no_peserta, users, atribut) {
    return new Promise(function (resolve, reject) {
        var data = {
            scan_keringanan: users.scan_keringanan,
            flag: req.body.flag,
        }

        if (req.file !== undefined) {
            data.scan_keringanan = req.body.flag == "" ? "" : req.file.filename;
        }

        Keringanan.update(data, {
            where: {
                no_peserta: no_peserta,
                atribut: atribut
            }
        }).then(function (response) {
            resolve(response)
        }).catch(function (err) {
            reject(err)
        })
    })
}

keringanan.prototype.addLog = function (users, atribut, executor, timestamp) {
    return new Promise(function (resolve, reject) {
        LogKeringanan.create({
            no_peserta: users.no_peserta,
            scan_keringanan: users.scan_keringanan,
            flag: users.flag,
            atribut: atribut,
            executor: executor,
            timestamp: timestamp
        }, {
            field: [
                'no_peserta',
                'scan_keringanan',
                'flag',
                'atribut',
                'executor',
                'atribut'
            ]
        }).then(function (response) {
            resolve(response)
        }).catch(function (err) {
            reject(err)
        })
    })
}

keringanan.prototype.getByLoggedIn = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        Keringanan.findOne({
            where: {
                no_peserta: no_peserta
            }
        }).then(function (response) {
            resolve(response)
        }).catch(function (err) {
            reject(err)
        })
    })
}

keringanan.prototype.checkData = function (no_peserta) {
    return new Promise((resolve, reject) => {
        Keringanan.findOne({
            where: {
                no_peserta: no_peserta
            },
            raw: true,
        }).then(function (response) {
            var result = true

            for (var key in response) {
                result *= (response[key] !== 0 && response[key] !== "")
            }
            resolve(result)
        }).catch(function (err) {
            reject(err)
        })
    })
}

module.exports = keringanan
