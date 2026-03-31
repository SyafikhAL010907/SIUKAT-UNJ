var Ayah = require("../models/ayah");
var LogAyah = require("../models/log_ayah");
var Provinsi = require("../models/provinsi");
var Kabkot = require("../models/kabkot");
var Kecamatan = require("../models/kecamatan");
var Pekerjaan = require("../models/pekerjaan");

var ayah = function () { };

ayah.prototype.add = function (req, atribut) {
    return new Promise(function (resolve, reject) {
        Ayah.create(
            {
                no_peserta: req.no_peserta,
                status_ayah: req.status_ayah,
                nama_ayah: req.nama_ayah,
                nik_ayah: req.nik_ayah,
                telepon_ayah: req.telepon_ayah,
                alamat_ayah: req.alamat_ayah,
                provinsi_ayah: req.provinsi_ayah,
                kabkot_ayah: req.kabkot_ayah,
                kecamatan_ayah: req.kecamatan_ayah,
                pekerjaan_ayah: req.pekerjaan_ayah,
                penghasilan_ayah: req.penghasilan_ayah,
                sampingan_ayah: req.sampingan_ayah,
                scan_ktp_ayah: req.scan_ktp_ayah,
                scan_slip_ayah: req.scan_slip_ayah,
                tempat_lahir_ayah: req.tempat_lahir_ayah,
                tanggal_lahir_ayah: req.tanggal_lahir_ayah,
                atribut: atribut,
            },
            {
                fields: [
                    "no_peserta",
                    "status_ayah",
                    "nama_ayah",
                    "nik_ayah",
                    "telepon_ayah",
                    "alamat_ayah",
                    "provinsi_ayah",
                    "kabkot_ayah",
                    "kecamatan_ayah",
                    "pekerjaan_ayah",
                    "penghasilan_ayah",
                    "sampingan_ayah",
                    "scan_ktp_ayah",
                    "scan_slip_ayah",
                    "tempat_lahir_ayah",
                    "tanggal_lahir_ayah",
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

ayah.prototype.edit = function (req, no_peserta, atribut) {
    return new Promise(function (resolve, reject) {
        var data = {
            nama_ayah: req.body.nama_ayah,
            status_ayah: req.body.status_ayah,
            nik_ayah: req.body.status_ayah == "wafat" ? "" : req.body.nik_ayah,
            telepon_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.telepon_ayah,
            alamat_ayah: req.body.status_ayah == "wafat" ? "" : req.body.alamat_ayah,
            provinsi_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.provinsi_ayah,
            kabkot_ayah: req.body.status_ayah == "wafat" ? "" : req.body.kabkot_ayah,
            kecamatan_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.kecamatan_ayah,
            pekerjaan_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.pekerjaan_ayah,
            penghasilan_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.penghasilan_ayah,
            sampingan_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.sampingan_ayah,
            tempat_lahir_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.tempat_lahir_ayah,
            tanggal_lahir_ayah:
                req.body.status_ayah == "wafat" ? "" : req.body.tanggal_lahir_ayah,
            // scan_ktp_ayah: '',
            // scan_slip_ayah: ''
        };

        // Jika tidak bekerja
        // if (req.body.pekerjaan_ayah === "11") {
        //   data.penghasilan_ayah = "";
        //   data.sampingan_ayah = "";
        //   data.scan_slip_ayah = "";
        // }

        if (req.files["file_scan_ktp_ayah"] !== undefined) {
            data.scan_ktp_ayah =
                req.body.status_ayah == "wafat"
                    ? ""
                    : req.files["file_scan_ktp_ayah"][0].filename;
        }

        if (req.files["file_scan_slip_ayah"] !== undefined) {
            data.scan_slip_ayah =
                req.body.status_ayah == "wafat"
                    ? ""
                    : req.files["file_scan_slip_ayah"][0].filename;
        }

        Ayah.update(data, {
            where: {
                no_peserta: no_peserta,
                atribut: atribut,
            },
        })
            .then(function (response) {
                resolve({
                    ...response,
                    no_peserta: no_peserta,
                    atribut: atribut,
                });
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

ayah.prototype.addLog = function (users, atribut, executor, timestamp) {
    return new Promise(function (resolve, reject) {
        LogAyah.create(
            {
                no_peserta: users.no_peserta,
                status_ayah: users.status_ayah,
                nama_ayah: users.nama_ayah,
                nik_ayah: users.nik_ayah,
                telepon_ayah: users.telepon_ayah,
                alamat_ayah: users.alamat_ayah,
                provinsi_ayah: users.provinsi_ayah,
                kabkot_ayah: users.kabkot_ayah,
                kecamatan_ayah: users.kecamatan_ayah,
                pekerjaan_ayah: users.pekerjaan_ayah,
                penghasilan_ayah: users.penghasilan_ayah,
                sampingan_ayah: users.sampingan_ayah,
                scan_ktp_ayah: users.scan_ktp_ayah,
                scan_slip_ayah: users.scan_slip_ayah,
                tempat_lahir_ayah: users.tempat_lahir_ayah,
                tanggal_lahir_ayah: users.tanggal_lahir_ayah,
                atribut: atribut,
                executor: executor,
                timestamp: timestamp,
            },
            {
                fields: [
                    "no_peserta",
                    "status_ayah",
                    "nama_ayah",
                    "nik_ayah",
                    "telepon_ayah",
                    "alamat_ayah",
                    "provinsi_ayah",
                    "kabkot_ayah",
                    "kecamatan_ayah",
                    "pekerjaan_ayah",
                    "penghasilan_ayah",
                    "sampingan_ayah",
                    "scan_ktp_ayah",
                    "scan_slip_ayah",
                    "tempat_lahir_ayah",
                    "tanggal_lahir_ayah",
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

ayah.prototype.getByLoggedIn = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        Ayah.findOne({
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

ayah.prototype.checkData = function (no_peserta, users) {
    return new Promise((resolve, reject) => {
        Ayah.findOne({
            where: {
                no_peserta: no_peserta,
            },
            raw: true,
        })
            .then(function (response) {
                var result = true;
                var data = {};
                if (response.status_ayah === "wafat") {
                    data.nama_ayah = response.nama_ayah;
                } else {
                    if (users.ukt_tinggi === "ya") {
                        delete response.nik_ayah;
                        delete response.pekerjaan_ayah;
                        delete response.penghasilan_ayah;
                        delete response.scan_ktp_ayah;
                        delete response.scan_slip_ayah;
                    }

                    // Jika tidak bekerja
                    if (response.pekerjaan_ayah === "11") {
                        delete response.penghasilan_ayah;
                        delete response.scan_slip_ayah;
                    }

                    delete response.sampingan_ayah;
                    // delete response.telepon_ayah
                    data = response;
                }
                for (var key in data) {
                    result *= !!data[key];
                    console.log({ key, value: data[key] });
                    // result *= data[key] !== null && data[key] !== "" && data[key] !== 0;
                }
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

module.exports = ayah;
