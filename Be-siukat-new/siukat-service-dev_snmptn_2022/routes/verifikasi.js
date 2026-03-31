var express = require("express");
var router = express.Router();
var db = require("../config/database");
var Verifikasi = require("../models/verifikasi");
var CMahasiswa = require("../models/cmahasiswa");
var Info = require("../models/info");
var passport = require("passport");

router.get("/", passport.authenticate("jwt", { session: false }), function (
    req,
    res
) {
    return db
        .transaction(function (t) {
            var data = {};
            Info.findOne()
                .then((info) => {
                    data.info = info;
                    return Verifikasi.findOne({
                        where: { no_peserta: req.user.no_peserta },
                    });
                })
                .then((verifikasi) => {
                    data.verifikasi = verifikasi;

                    return CMahasiswa.findOne({
                        where: { no_peserta: req.user.no_peserta },
                    });
                })
                .then((cmahasiswa) => {
                    data.result_bidikmisi = data.verifikasi.ver_bidik_misi;
                    data.result_kipk = data.verifikasi.ver_kipk;
                    data.result_kjmu = data.verifikasi.ver_kjmu;
                    if (data.info.stage === "snmptn") {
                        if (
                            cmahasiswa.fakultas_cmahasiswa.toString() === "16" ||
                            cmahasiswa.prodi_cmahasiswa.toString() === "12076" ||
                            cmahasiswa.prodi_cmahasiswa.toString() === "12086" ||
                            cmahasiswa.prodi_cmahasiswa.toString() === "12066"
                        ) {
                            if (
                                data.verifikasi.ver_akademik === "lolos" &&
                                data.verifikasi.ver_keterampilan === "lolos"
                            ) {
                                // Jika akademik dan keterampilan lolos, bidik misi mengikuti
                                data.result_akademik = "lolos";
                            } else if (
                                data.verifikasi.ver_akademik === "tidak_lolos" ||
                                data.verifikasi.ver_keterampilan === "tidak_lolos"
                            ) {
                                // Jika akademik atau keterampilan tidak lolos, maka bidik misi juga tidak lolos
                                data.result_akademik = "tidak_lolos";
                            } else if (
                                data.verifikasi.ver_akademik === "belum_verifikasi" ||
                                data.verifikasi.ver_keterampilan === "belum_verifikasi"
                            ) {
                                // Jika akademik atau keterampilan belum verifikasi, maka bidik misi mengikuti
                                data.result_akademik = "belum_verifikasi";
                            }
                        } else {
                            // Akademik tidak mempertimbangkan keterampilan (EQUAL)
                            data.result_akademik = data.verifikasi.ver_akademik;
                            data.result_bidikmisi = data.verifikasi.ver_bidik_misi;
                            data.result_kipk = data.verifikasi.ver_kipk;
                            data.result_kjmu = data.verifikasi.ver_kjmu;
                        }
                    } else if (data.info.stage === "sbmptn") {
                        // Semua lolos akademik, bidik misi mengikuti
                        data.result_akademik = "lolos";
                    } else {
                        // Mandiri
                        // Semua lolos akademik, bidik misi tidak ada
                        data.result_akademik = "lolos";
                    }
                    res.json(data);
                });
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});

module.exports = router;
