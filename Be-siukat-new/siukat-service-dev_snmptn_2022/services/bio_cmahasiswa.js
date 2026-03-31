var BioCMahasiswa = require("../models/bio_cmahasiswa");
// var LogAyah = require('../models/log_ayah');
// var Provinsi = require('../models/provinsi')
// var Kabkot = require('../models/kabkot')
// var Kecamatan = require('../models/kecamatan')
var Wilayah = require("../models/bio_ref_wilayah");
var Agama = require("../models/bio_ref_agama");
var Tinggal = require("../models/bio_ref_tinggal");
var Transportasi = require("../models/bio_ref_transportasi");

var biocmahasiswa = function () {};

biocmahasiswa.prototype.edit = function (req, no_peserta) {
  console.warn("Req Body: ");
  console.log(req.body);
  return new Promise(function (resolve, reject) {
    // console.log("nama " + req.nama);
    req.body.no_kps = req.body.terima_kps == "0" ? null : req.body.no_kps;
    var data = {
      nama: req.body.nama,
      tempat_lahir_cmahasiswa: req.body.tempat_lahir_cmahasiswa,
      tanggal_lahir_cmahasiswa: req.body.tanggal_lahir_cmahasiswa,
      jenis_kelamin: req.body.jenis_kelamin,
      kode_agama: req.body.kode_agama,
      alamat: req.body.alamat,
      rt: req.body.rt,
      rw: req.body.rw,
      kelurahan: req.body.kelurahan,
      email: req.body.email,
      kode_pos: req.body.kode_pos,
      kode_provinsi: req.body.kode_provinsi,
      kode_kabkot: req.body.kode_kabkot,
      kode_kecamatan: req.body.kode_kecamatan,
      nik: req.body.nik,
      npwp: req.body.npwp,
      kewarganegaraan: req.body.kewarganegaraan,
      dusun: req.body.dusun,
      kode_tinggal: req.body.kode_tinggal,
      kode_transportasi: req.body.kode_transportasi,
      telp: req.body.telp,
      hp: req.body.hp,
      terima_kps: req.body.terima_kps,
      no_kps: req.body.no_kps,
    };

    BioCMahasiswa.update(data, {
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
        if (err.message == "Query was empty") {
          console.log(
            "There is no changes in the update, lets continue the progress..."
          );
          // next();
        }
        console.log(err);
        reject(err);
      });
  });
};

biocmahasiswa.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    BioCMahasiswa.findOne({
      where: {
        no_peserta: no_peserta,
      },
      include: [
        Agama,
        Tinggal,
        { model: Wilayah, as: "Provinsi" },
        { model: Wilayah, as: "Kabkot" },
        { model: Wilayah, as: "Kecamatan" },
        Transportasi,
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

biocmahasiswa.prototype.checkData = function (no_peserta) {
  return new Promise((resolve, reject) => {
    BioCMahasiswa.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
        delete response.npwp;
        delete response.terima_kps;
        delete response.no_kps;

        for (var key in response) {
          result *=
            response[key] !== 0 &&
            response[key] !== "" &&
            response[key] !== null;
        }
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

biocmahasiswa.prototype.selesaiIsi = (no_peserta) => {
  return new Promise((resolve, reject) => {
    BioCMahasiswa.update(
      {
        flag_lengkap: "1",
      },
      {
        where: {
          no_peserta: no_peserta,
        },
      }
    )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = biocmahasiswa;
