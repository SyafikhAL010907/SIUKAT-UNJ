var Rumah = require("../models/rumah");
var LogRumah = require("../models/log_rumah");

var rumah = function () {};

rumah.prototype.add = function (req, atribut) {
  return new Promise(function (resolve, reject) {
    Rumah.create(
      {
        no_peserta: req.no_peserta,
        status_kepemilikan: req.status_kepemilikan,
        luas_tanah: req.luas_tanah,
        luas_bangunan: req.luas_bangunan,
        status_sertifikat: req.status_sertifikat,
        biaya_pbb: req.biaya_pbb,
        scan_pbb: req.scan_pbb,
        biaya_kontrak: req.biaya_kontrak,
        scan_kontrak: req.scan_kontrak,
        jumlah_kepala_keluarga: req.jumlah_kepala_keluarga,
        atribut: atribut,
      },
      {
        field: [
          "no_peserta",
          "status_kepemilikan",
          "luas_tanah",
          "luas_bangunan",
          "status_sertifikat",
          "biaya_pbb",
          "scan_pbb",
          "biaya_kontrak",
          "scan_kontrak",
          "jumlah_kepala_keluarga",
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

rumah.prototype.edit = function (req, no_peserta, atribut) {
  return new Promise(function (resolve, reject) {
    var data = {};

    if (req.body.status_kepemilikan === "milik_sendiri") {
      data.status_kepemilikan = req.body.status_kepemilikan;
      data.luas_tanah = req.body.luas_tanah;
      data.luas_bangunan = req.body.luas_bangunan;
      data.status_sertifikat = req.body.status_sertifikat;
      data.biaya_pbb = req.body.biaya_pbb;
      if (req.files["file_scan_pbb"] !== undefined) {
        data.scan_pbb = req.files["file_scan_pbb"][0].filename;
      }
      data.biaya_kontrak = "";
      data.scan_kontrak = "";
      data.jumlah_kepala_keluarga = 1;
    } else if (req.body.status_kepemilikan === "bersama_saudara") {
      data.status_kepemilikan = req.body.status_kepemilikan;
      data.luas_tanah = req.body.luas_tanah;
      data.luas_bangunan = req.body.luas_bangunan;
      data.status_sertifikat = "";
      data.biaya_pbb = req.body.biaya_pbb;
      if (req.files["file_scan_pbb"] !== undefined) {
        data.scan_pbb = req.files["file_scan_pbb"][0].filename;
      }
      data.biaya_kontrak = "";
      data.scan_kontrak = "";
      data.jumlah_kepala_keluarga = req.body.jumlah_kepala_keluarga;
    } else if (req.body.status_kepemilikan === "kontrak") {
      data.status_kepemilikan = req.body.status_kepemilikan;
      data.luas_tanah = "";
      data.luas_bangunan = "";
      data.status_sertifikat = "";
      data.biaya_pbb = "";
      data.scan_pbb = "";
      data.biaya_kontrak = req.body.biaya_kontrak;
      if (req.files["file_scan_kontrak"] !== undefined) {
        data.scan_kontrak = req.files["file_scan_kontrak"][0].filename;
      }
      data.jumlah_kepala_keluarga = 1;
    } else {
      data.status_kepemilikan = req.body.status_kepemilikan;
      data.luas_tanah = "";
      data.luas_bangunan = "";
      data.status_sertifikat = "";
      data.biaya_pbb = "";
      data.scan_pbb = "";
      data.biaya_kontrak = "";
      data.scan_kontrak = "";
      data.jumlah_kepala_keluarga = 1;
    }

    Rumah.update(data, {
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

rumah.prototype.addLog = function (users, atribut, executor, timestamp) {
  return new Promise(function (resolve, reject) {
    LogRumah.create(
      {
        no_peserta: users.no_peserta,
        status_kepemilikan: users.status_kepemilikan,
        luas_tanah: users.luas_tanah,
        luas_bangunan: users.luas_bangunan,
        status_sertifikat: users.status_sertifikat,
        biaya_pbb: users.biaya_pbb,
        scan_pbb: users.scan_pbb,
        biaya_kontrak: users.biaya_kontrak,
        scan_kontrak: users.scan_kontrak,
        jumlah_kepala_keluarga: users.jumlah_kepala_keluarga,
        atribut: atribut,
        executor: executor,
        timestamp: timestamp,
      },
      {
        fields: [
          "no_peserta",
          "status_kepemilikan",
          "luas_tanah",
          "luas_bangunan",
          "status_sertifikat",
          "biaya_pbb",
          "scan_pbb",
          "biaya_kontrak",
          "scan_kontrak",
          "jumlah_kepala_keluarga",
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

rumah.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    Rumah.findOne({
      where: {
        no_peserta: no_peserta,
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

rumah.prototype.checkData = function (no_peserta) {
  return new Promise((resolve, reject) => {
    Rumah.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
        if (response.status_kepemilikan !== "kontrak") {
          if (response.status_kepemilikan === "bersama_saudara") {
            delete response.status_sertifikat;
          } else if (response.status_kepemilikan === "menumpang") {
            delete response.luas_tanah;
            delete response.luas_bangunan;
            delete response.status_sertifikat;
            delete response.biaya_pbb;
            delete response.scan_pbb;
            delete response.jumlah_kepala_keluarga;
          }
          delete response.biaya_kontrak;
          delete response.scan_kontrak;
        } else if (response.status_kepemilikan === "kontrak") {
          delete response.luas_tanah;
          delete response.luas_bangunan;
          delete response.status_sertifikat;
          delete response.biaya_pbb;
          delete response.scan_pbb;
        }
        for (var key in response) {
          result *= response[key] !== null && response[key] !== "";
        }
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = rumah;
