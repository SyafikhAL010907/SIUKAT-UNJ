var Listrik = require("../models/listrik");
var LogListrik = require("../models/log_listrik");

var listrik = function () {};

listrik.prototype.add = function (req, atribut) {
  return new Promise(function (resolve, reject) {
    Listrik.create(
      {
        no_peserta: req.no_peserta,
        no_pelanggan: req.no_pelanggan,
        jenis_pemakaian: req.jenis_pemakaian,
        pengeluaran: req.pengeluaran,
        scan_listrik: req.scan_listrik,
        atribut: atribut,
      },
      {
        fields: [
          "no_peserta",
          "no_pelanggan",
          "jenis_pemakaian",
          "pengeluaran",
          "scan_listrik",
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

listrik.prototype.edit = function (req, no_peserta, atribut) {
  return new Promise(function (resolve, reject) {
    var data = {
      no_pelanggan: req.body.no_pelanggan,
      jenis_pemakaian: req.body.jenis_pemakaian,
      pengeluaran: req.body.pengeluaran,
    };

    if (req.file !== undefined) {
      data.scan_listrik = req.file.filename;
    }

    Listrik.update(data, {
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

listrik.prototype.addLog = function (users, atribut, executor, timestamp) {
  return new Promise(function (resolve, reject) {
    LogListrik.create(
      {
        no_pelanggan: users.no_pelanggan,
        jenis_pemakaian: users.jenis_pemakaian,
        pengeluaran: users.pengeluaran,
        scan_listrik: users.scan_listrik,
        atribut: atribut,
        executor: executor,
        timestamp: timestamp,
      },
      {
        fields: [
          "no_peserta",
          "no_pelanggan",
          "jenis_pemakaian",
          "pengeluaran",
          "scan_listrik",
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

listrik.prototype.getByLoggedIn = function (no_peserta) {
  return new Promise(function (resolve, reject) {
    Listrik.findOne({
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

listrik.prototype.checkData = function (no_peserta) {
  return new Promise((resolve, reject) => {
    Listrik.findOne({
      where: {
        no_peserta: no_peserta,
      },
      raw: true,
    })
      .then(function (response) {
        var result = true;
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

module.exports = listrik;
