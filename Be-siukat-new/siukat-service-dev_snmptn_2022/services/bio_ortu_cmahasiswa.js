var BioOrtuCHahasiswa = require("../models/bio_ortu_cmahasiswa");
// var LogAyah = require('../models/log_ayah');
// var Provinsi = require('../models/provinsi')
// var Kabkot = require('../models/kabkot')
// var Kecamatan = require('../models/kecamatan')
var Wilayah = require("../models/bio_ref_wilayah");
var Agama = require("../models/bio_ref_agama");
var Tinggal = require("../models/bio_ref_tinggal");
var Transportasi = require("../models/bio_ref_transportasi");
var Pekerjaan = require("../models/bio_ref_pekerjaan");
var Pendidikan = require("../models/bio_ref_pendidikan");
var Penghasilan = require("../models/bio_ref_penghasilan");

var bio_ortu_cmahasiswa = function () {};

bio_ortu_cmahasiswa.prototype.edit = function (req, no_peserta) {
  return new Promise(function (resolve, reject) {
    if (typeof req.body.pilih_wali !== "undefined") {
      if (req.body.pilih_wali != "lainnya") {
        req.body.nama_wali = null;
        req.body.pendidikan_wali = null;
        req.body.penghasilan_wali = null;
        req.body.pekerjaan_wali = null;
        req.body.nik_wali = null;
        req.body.tanggal_lahir_wali = null;
      }
    }
    var data = {
      nama_ayah: req.body.nama_ayah,
      nama_ibu: req.body.nama_ibu,
      pilih_wali: req.body.pilih_wali,
      hubungan_wali: req.body.hubungan_wali,
      pendidikan_ayah: req.body.pendidikan_ayah,
      pendidikan_ibu: req.body.pendidikan_ibu,
      penghasilan_ayah: req.body.penghasilan_ayah,
      penghasilan_ibu: req.body.penghasilan_ibu,
      pekerjaan_ayah: req.body.pekerjaan_ayah,
      pekerjaan_ibu: req.body.pekerjaan_ibu,
      alamat: req.body.alamat,
      rt: req.body.rt,
      rw: req.body.rw,
      kelurahan: req.body.kelurahan,
      kode_pos: req.body.kode_pos,
      kode_provinsi: req.body.kode_provinsi,
      kode_kabkot: req.body.kode_kabkot,
      kode_kecamatan: req.body.kode_kecamatan,
      kontak: req.body.kontak,
      nik_ayah: req.body.nik_ayah,
      nik_ibu: req.body.nik_ibu,
      tanggal_lahir_ayah: req.body.tanggal_lahir_ayah,
      tanggal_lahir_ibu: req.body.tanggal_lahir_ibu,
      nama_wali: req.body.nama_wali,
      pendidikan_wali: req.body.pendidikan_wali,
      penghasilan_wali: req.body.penghasilan_wali,
      pekerjaan_wali: req.body.pekerjaan_wali,
      nik_wali: req.body.nik_wali,
      tanggal_lahir_wali: req.body.tanggal_lahir_wali,
    };

    BioOrtuCHahasiswa.update(data, {
      where: {
        no_peserta: no_peserta,
        // atribut: atribut,
      },
    })
      .then(function (response) {
        resolve({
          ...response,
          no_peserta: no_peserta,
          //   atribut: atribut,
        });
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

bio_ortu_cmahasiswa.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    BioOrtuCHahasiswa.findOne({
      where: {
        no_peserta: no_peserta,
      },
      include: [
        { model: Pendidikan, as: "detail_pendidikan_ayah" },
        { model: Pendidikan, as: "detail_pendidikan_ibu" },
        { model: Pendidikan, as: "detail_pendidikan_wali" },
        { model: Pekerjaan, as: "detail_pekerjaan_ayah" },
        { model: Pekerjaan, as: "detail_pekerjaan_ibu" },
        { model: Pekerjaan, as: "detail_pekerjaan_wali" },
        { model: Penghasilan, as: "detail_penghasilan_ayah" },
        { model: Penghasilan, as: "detail_penghasilan_ibu" },
        { model: Penghasilan, as: "detail_penghasilan_wali" },
        { model: Wilayah, as: "provinsi" },
        { model: Wilayah, as: "kabkot" },
        { model: Wilayah, as: "kecamatan" },
      ],
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

bio_ortu_cmahasiswa.prototype.checkData = function (no_peserta) {
  return new Promise((resolve, reject) => {
    BioOrtuCHahasiswa.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
        delete response.nama_wali;
        delete response.nik_wali;
        delete response.hubungan_wali;
        delete response.pekerjaan_wali;
        delete response.pendidikan_wali;
        delete response.penghasilan_wali;
        delete response.tanggal_lahir_wali;
        console.log(response);
        for (var key in response) {
          result *=
            response[key] !== 0 &&
            response[key] !== "" &&
            response[key] !== null;
        }
        console.log(result);
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = bio_ortu_cmahasiswa;
