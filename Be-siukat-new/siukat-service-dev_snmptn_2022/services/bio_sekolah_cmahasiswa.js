var BioSekolahCHahasiswa = require("../models/bio_sekolah_cmahasiswa");
var Jurusan = require("../models/bio_ref_jurusan");
var DataSekolah = require("../models/data_sekolah");
var Wilayah = require("../models/bio_ref_wilayah");
var Agama = require("../models/bio_ref_agama");
var Tinggal = require("../models/bio_ref_tinggal");
var Transportasi = require("../models/bio_ref_transportasi");

var bio_sekolah_cmahasiswa = function () {};

bio_sekolah_cmahasiswa.prototype.edit = function (req, no_peserta) {
  return new Promise(function (resolve, reject) {
    var data = {
      nisn: req.body.nisn,
      kode_jurusan: req.body.kode_jurusan,
      tahun_masuk: req.body.tahun_masuk,
      tahun_lulus: req.body.tahun_lulus,
      rata_UN: req.body.rata_UN,
      mapel_UN: req.body.mapel_UN,
      no_peserta_UN: req.body.no_peserta_UN,
      rata_ijazah: req.body.rata_ijazah,
      mapel_ijazah: req.body.mapel_ijazah,
      no_ijazah: req.body.no_ijazah,
      no_peserta_UN: req.body.no_peserta_UN,
      alamat_sekolah: req.body.alamat_sekolah,
    };

    BioSekolahCHahasiswa.update(data, {
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

bio_sekolah_cmahasiswa.prototype.update = function (req, no_peserta) {
  return new Promise(function (resolve, reject) {
    var data = {
      nisn: req.body.nisn,
      npsn: req.body.npsn,
      kode_jurusan: req.body.kode_jurusan,
      tahun_masuk: req.body.tahun_masuk,
      tahun_lulus: req.body.tahun_lulus,
      rata_UN: req.body.rata_UN,
      mapel_UN: req.body.mapel_UN,
      no_peserta_UN: req.body.no_peserta_UN,
      rata_ijazah: req.body.rata_ijazah,
      mapel_ijazah: req.body.mapel_ijazah,
      no_ijazah: req.body.no_ijazah,
      no_peserta_UN: req.body.no_peserta_UN,
      alamat_sekolah: req.body.alamat_sekolah,
    };

    if (req.files["file_scan_skl_ijazah"] !== undefined) {
      data.scan_skl_ijazah = req.files["file_scan_skl_ijazah"][0].filename;
    }

    BioSekolahCHahasiswa.update(data, {
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

bio_sekolah_cmahasiswa.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    BioSekolahCHahasiswa.findOne({
      where: {
        no_peserta: no_peserta,
      },
      include: [DataSekolah, Jurusan],
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

bio_sekolah_cmahasiswa.prototype.checkData = function (no_peserta) {
  return new Promise((resolve, reject) => {
    BioSekolahCHahasiswa.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
        delete response.rata_UN;
        delete response.rata_ijazah;
        delete response.mapel_UN;
        delete response.mapel_ijazah;

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

module.exports = bio_sekolah_cmahasiswa;
