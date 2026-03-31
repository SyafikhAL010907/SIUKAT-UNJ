var Ibu = require("../models/ibu");
var LogIbu = require("../models/log_ibu");
var Provinsi = require("../models/provinsi");
var Kabkot = require("../models/kabkot");
var Kecamatan = require("../models/kecamatan");
var Pekerjaan = require("../models/pekerjaan");

var ibu = function () { };

ibu.prototype.add = function (req, atribut) {
  return new Promise(function (resolve, reject) {
    Ibu.create(
      {
        no_peserta: req.no_peserta,
        status_ibu: req.status_ibu,
        nama_ibu: req.nama_ibu,
        nik_ibu: req.nik_ibu,
        telepon_ibu: req.telepon_ibu,
        alamat_ibu: req.alamat_ibu,
        provinsi_ibu: req.provinsi_ibu,
        kabkot_ibu: req.kabkot_ibu,
        kecamatan_ibu: req.kecamatan_ibu,
        pekerjaan_ibu: req.pekerjaan_ibu,
        penghasilan_ibu: req.penghasilan_ibu,
        sampingan_ibu: req.sampingan_ibu,
        scan_ktp_ibu: req.scan_ktp_ibu,
        scan_slip_ibu: req.scan_slip_ibu,
        tempat_lahir_ibu: req.tempat_lahir_ibu,
        tanggal_lahir_ibu: req.tanggal_lahir_ibu,
        atribut: atribut,
      },
      {
        fields: [
          "no_peserta",
          "status_ibu",
          "nama_ibu",
          "nik_ibu",
          "telepon_ibu",
          "alamat_ibu",
          "provinsi_ibu",
          "kabkot_ibu",
          "kecamatan_ibu",
          "pekerjaan_ibu",
          "penghasilan_ibu",
          "sampingan_ibu",
          "scan_ktp_ibu",
          "scan_slip_ibu",
          "tempat_lahir_ibu",
          "tanggal_lahir_ibu",
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

ibu.prototype.edit = function (req, no_peserta, atribut) {
  return new Promise(function (resolve, reject) {
    var data = {
      nama_ibu: req.body.nama_ibu,
      status_ibu: req.body.status_ibu,
      nik_ibu: req.body.status_ibu == "wafat" ? "" : req.body.nik_ibu,
      telepon_ibu: req.body.status_ibu == "wafat" ? "" : req.body.telepon_ibu,
      alamat_ibu: req.body.status_ibu == "wafat" ? "" : req.body.alamat_ibu,
      provinsi_ibu: req.body.status_ibu == "wafat" ? "" : req.body.provinsi_ibu,
      kabkot_ibu: req.body.status_ibu == "wafat" ? "" : req.body.kabkot_ibu,
      kecamatan_ibu:
        req.body.status_ibu == "wafat" ? "" : req.body.kecamatan_ibu,
      pekerjaan_ibu:
        req.body.status_ibu == "wafat" ? "" : req.body.pekerjaan_ibu,
      penghasilan_ibu:
        req.body.status_ibu == "wafat" ? "" : req.body.penghasilan_ibu,
      sampingan_ibu:
        req.body.status_ibu == "wafat" ? "" : req.body.sampingan_ibu,
      tempat_lahir_ibu:
        req.body.status_ibu == "wafat" ? "" : req.body.tempat_lahir_ibu,
      tanggal_lahir_ibu:
        req.body.status_ibu == "wafat" ? "" : req.body.tanggal_lahir_ibu,
      // scan_ktp_ibu: '',
      // scan_slip_ibu: '',
    };

    // Jika tidak bekerja
    // if (req.body.pekerjaan_ibu === "11") {
    //   data.penghasilan_ibu = "";
    //   data.sampingan_ibu = "";
    //   data.scan_slip_ibu = "";
    // }

    if (req.files["file_scan_ktp_ibu"] !== undefined) {
      data.scan_ktp_ibu =
        req.body.status_ibu == "wafat"
          ? ""
          : req.files["file_scan_ktp_ibu"][0].filename;
    }
    if (req.files["file_scan_slip_ibu"] !== undefined) {
      data.scan_slip_ibu =
        req.body.status_ibu == "wafat"
          ? ""
          : req.files["file_scan_slip_ibu"][0].filename;
    }

    Ibu.update(data, {
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

ibu.prototype.addLog = function (users, atribut, executor, timestamp) {
  return new Promise(function (resolve, reject) {
    LogIbu.create(
      {
        no_peserta: users.no_peserta,
        status_ibu: users.status_ibu,
        nama_ibu: users.nama_ibu,
        nik_ibu: users.nik_ibu,
        telepon_ibu: users.telepon_ibu,
        alamat_ibu: users.alamat_ibu,
        provinsi_ibu: users.provinsi_ibu,
        kabkot_ibu: users.kabkot_ibu,
        kecamatan_ibu: users.kecamatan_ibu,
        pekerjaan_ibu: users.pekerjaan_ibu,
        penghasilan_ibu: users.penghasilan_ibu,
        sampingan_ibu: users.sampingan_ibu,
        scan_ktp_ibu: users.scan_ktp_ibu,
        scan_slip_ibu: users.scan_slip_ibu,
        tempat_lahir_ibu: users.tempat_lahir_ibu,
        tanggal_lahir_ibu: users.tanggal_lahir_ibu,
        atribut: atribut,
        executor: executor,
        timestamp: timestamp,
      },
      {
        fields: [
          "no_peserta",
          "status_ibu",
          "nama_ibu",
          "nik_ibu",
          "telepon_ibu",
          "alamat_ibu",
          "provinsi_ibu",
          "kabkot_ibu",
          "kecamatan_ibu",
          "pekerjaan_ibu",
          "penghasilan_ibu",
          "sampingan_ibu",
          "scan_ktp_ibu",
          "scan_slip_ibu",
          "tempat_lahir_ibu",
          "tanggal_lahir_ibu",
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

ibu.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    Ibu.findOne({
      where: {
        no_peserta: no_peserta,
      },
      include: [Provinsi, Kabkot, Kecamatan, Pekerjaan],
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

ibu.prototype.checkData = function (no_peserta, users) {
  return new Promise((resolve, reject) => {
    Ibu.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
        var data = {};
        if (response.status_ibu === "wafat") {
          data.nama_ibu = response.nama_ibu;
        } else {
          if (users.ukt_tinggi === "ya") {
            delete response.nik_ibu;
            delete response.pekerjaan_ibu;
            delete response.penghasilan_ibu;
            delete response.scan_ktp_ibu;
            delete response.scan_slip_ibu;
          }

          // Jika tidak bekerja
          if (response.pekerjaan_ibu === "11") {
            // delete response.scan_slip_ibu
            delete response.penghasilan_ibu
          }

          delete response.sampingan_ibu;
          // delete response.telepon_ibu
          data = response;
        }

        for (var key in data) {
          result *= data[key] !== null && data[key] !== "" && data[key] !== 0;
        }
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = ibu;
