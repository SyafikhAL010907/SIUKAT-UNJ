var express = require("express");
var router = express.Router();
var db = require("../config/database");
var Ukt = require("../models/ukt");
var Value = require("../models/value");
var LogValue = require("../models/log_value");
var Info = require("../models/info");
var passport = require("passport");
var { cmahasiswa, ukt, value, users } = require("../services");
var moment = require("moment");
var timestamp = moment().format().slice(0, 19).replace("T", " ");

router.get("/", passport.authenticate("jwt", { session: false }), function (
  req,
  res,
  next
) {
  return db.transaction(function (t) {
    users
      .getUser(req.user.no_peserta)
      .then(function (response) {
        Ukt.findOne({
          where: {
            major_id: response.prodi_cmahasiswa,
            entrance: response.jalur_cmahasiswa,
          },
        }).then((ukt) => {
          res.json(ukt);
        });
      })
      .catch(function (err) {
        res.status(500).json(err);
      });
  });
});

router.get(
  "/cmahasiswa/:no_peserta",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    return db.transaction(function (t) {
      users
        .getUser(req.params.no_peserta)
        .then(function (response) {
          Ukt.findOne({
            where: {
              major_id: response.prodi_cmahasiswa,
              entrance: response.jalur_cmahasiswa,
            },
          }).then((ukt) => {
            res.json(ukt);
          });
        })
        .catch(function (err) {
          res.status(500).json(err);
        });
    });
  }
);

router.put(
  "/tinggi-selesai",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Info.findOne()
      .then((info) => {
        return cmahasiswa.selesaiIsi(info, req.user.no_peserta);
      })
      .then((response) => {
        res.status(200).json("Data berhasil dikonfirmasi!");
      })
      .catch((err) => {
        res.status(500).json(err.statusText);
      });
  }
);

router.put(
  "/rendah-selesai",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return db.transaction(function (t) {
      ukt
        .computeUkt(req.user.no_peserta, "original")
        .then((response) => {
          return Info.findOne();
        })
        .then((info) => {
          return cmahasiswa.selesaiIsi(info, req.user.no_peserta);
        })
        .then((response) => {
          return Value.findOne({
            where: {
              no_peserta: req.user.no_peserta,
            },
          });
        })
        .then((response) => {
          return value.addLog(response, req.user.no_peserta, timestamp);
        })
        .then((response) => {
          return cmahasiswa.addLog(response, req.user.no_peserta, timestamp);
        })
        .then((response) => {
          res.status(200).json("Data berhasil dikonfirmasi!");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err.statusText);
        });
    });
  }
);

router.post(
  "/hitung-lagi-dong",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return db.transaction(function (t) {
      cmahasiswa.allSelesai().then((cmhs) => {
        // res.status(200).json(cmhs);
        cmhs.map((mhs) => {
          // console.log(mhs.no_peserta);
          ukt
            .computeUkt(mhs.no_peserta, (atribut = "original"))
            .then((response) => {
              return Info.findOne();
            })
            .then((info) => {
              return cmahasiswa.selesaiIsi(info, mhs.no_peserta);
            })
            .then((response) => {
              return Value.findOne({
                where: {
                  no_peserta: mhs.no_peserta,
                },
              });
            })
            .then((response) => {
              return value.addLog(response, req.user.no_peserta, timestamp);
            })
            .then((response) => {
              return cmahasiswa.addLog(
                response,
                req.user.no_peserta,
                timestamp
              );
            })
            .then((response) => {
              // console.log(response);
              result = "Data berhasil dikonfirmasi!";
              res.status(200).json({ result });
              // res.status(200).json(response);
            })
            .catch((err) => {
              // console.log(err);
              // res.status(500).json(err);
              next(err);
            });
        });
      });
    });
  }
);

// GENERATE TABLE UKT dari Versi Lama ke Baru
// return db.transaction((t) => {
//   var ukt = {}
//   Ukt.findAll({raw: true}).then( res => {
//     ukt = res
//     return Ukt.findAll({
//       group: ['kode_prodi', 'jalur'],
//       raw: true
//     })
//   }).then((groupBy) => {
//     res.render('ukt-table', {ukt: ukt, groupBy: groupBy})
//   }).catch(function(err){
//     res.status(500).json(err)
//   })
// })
module.exports = router;
