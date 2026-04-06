var Wali = require("../models/wali");
var LogWali = require("../models/log_wali");
var Provinsi = require("../models/provinsi");
var Kabkot = require("../models/kabkot");
var Kecamatan = require("../models/kecamatan");

var wali = function () { };

wali.prototype.add = function (req, atribut) {
  return new Promise(function (resolve, reject) {
    Wali.create(
      {
        no_peserta: req.no_peserta,
        status_wali: req.status_wali,
        nama_wali: req.nama_wali,
        alamat_wali: req.alamat_wali,
        provinsi_wali: req.provinsi_wali,
        kabkot_wali: req.kabkot_wali,
        kecamatan_wali: req.kecamatan_wali,
        kesanggupan_wali: req.kesanggupan_wali,
        scan_wali: req.scan_wali,
        atribut: atribut,
      },
      {
        fields: [
          "no_peserta",
          "nama_wali",
          "alamat_wali",
          "provinsi_wali",
          "kabkot_wali",
          "kecamatan_wali",
          "kesanggupan_wali",
          "scan_wali",
          "atribut",
        ],
      }
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

wali.prototype.edit = function (req, no_peserta, atribut) {
  return new Promise(function (resolve, reject) {
    var data = {
      status_wali: req.body.status_wali,
      nama_wali: req.body.status_wali == "tidak" ? "" : req.body.nama_wali,
      alamat_wali: req.body.status_wali == "tidak" ? "" : req.body.alamat_wali,
      provinsi_wali:
        req.body.status_wali == "tidak" ? "" : req.body.provinsi_wali,
      kabkot_wali: req.body.status_wali == "tidak" ? "" : req.body.kabkot_wali,
      kecamatan_wali:
        req.body.status_wali == "tidak" ? "" : req.body.kecamatan_wali,
      kesanggupan_wali:
        req.body.status_wali == "tidak" ? "" : req.body.kesanggupan_wali,
    };

    if (req.file !== undefined) {
      data.scan_wali = req.body.status_wali == "tidak" ? "" : req.file.filename;
    }

    Wali.update(data, {
      where: {
        no_peserta: no_peserta,
        atribut: atribut,
      },
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

wali.prototype.addLog = function (users, atribut, executor, timestamp) {
  return new Promise(function (resolve, reject) {
    LogWali.create(
      {
        no_peserta: users.no_peserta,
        status_wali: users.status_wali,
        nama_wali: users.nama_wali,
        alamat_wali: users.alamat_wali,
        provinsi_wali: users.provinsi_wali,
        kabkot_wali: users.kabkot_wali,
        kecamatan_wali: users.kecamatan_wali,
        kesanggupan_wali: users.kesanggupan_wali,
        scan_wali: users.scan_wali,
        atribut: atribut,
        executor: executor,
        timestamp: timestamp,
      },
      {
        fields: [
          "no_peserta",
          "nama_wali",
          "alamat_wali",
          "provinsi_wali",
          "kabkot_wali",
          "kecamatan_wali",
          "kesanggupan_wali",
          "scan_wali",
          "atribut",
          "executor",
          "timestamp",
        ],
      }
    )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

wali.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    Wali.findOne({
      where: {
        no_peserta: no_peserta,
      },
      include: [Provinsi, Kabkot, Kecamatan],
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

wali.prototype.checkData = function (no_peserta, users) {
  return new Promise((resolve, reject) => {
    Wali.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
        if (response.status_wali === "tidak") {
          delete response.nama_wali;
          delete response.alamat_wali;
          delete response.kesanggupan_wali;
          delete response.scan_wali;
          delete response.provinsi_wali;
          delete response.kabkot_wali;
          delete response.kecamatan_wali;
        }

        if (users.ukt_tinggi === "ya") {
          delete response.kesanggupan_wali;
          delete response.scan_wali;
        }

        console.log(response);
        for (var key in response) {
          result *= response[key] !== null && response[key] !== "" && response[key] !== '0' && response[key] !== 0;
        }
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = wali;
