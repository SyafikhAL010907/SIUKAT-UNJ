var CMahasiswa = require("../models/cmahasiswa");
var LogCMahasiswa = require("../models/log_cmahasiswa");
var Fakultas = require("../models/fakultas");
var Prodi = require("../models/prodi");
var Provinsi = require("../models/provinsi");
var Kabkot = require("../models/kabkot");
var Info = require("../models/info");
var Kecamatan = require("../models/kecamatan");
var Ukt = require("../models/ukt");
var moment = require("moment");
var timestamp = moment().format().slice(0, 19).replace("T", " ");
var db = require("../config/database");

var cmahasiswa = function () { };

const generateTagihan = (info, no_peserta) => {
    var stage = "";
    var year = moment().format("YY").toString();
    var tagihan = "";
    if (info.stage === "snmptn") {
        stage = 1;
    } else if (info.stage === "sbmptn") {
        stage = 2;
    } else if (info.stage === "mandiri") {
        stage = 3;
    } else {
        throw new Error("Stage False");
    }
    return (tagihan = year + stage + no_peserta);
};

cmahasiswa.prototype.all = function () {
    return new Promise(function (resolve, reject) {
        CMahasiswa.findAll({
            // limit: 5,
            include: [
                { model: Fakultas, as: "fakultas" },
                Prodi,
                Provinsi,
                Kabkot,
                Kecamatan,
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

const { Op } = require("sequelize");
cmahasiswa.prototype.allSelesai = function () {
    return new Promise(function (resolve, reject) {
        CMahasiswa.findAll({
            // limit: 5,
            // attributes: [
            //   "no_peserta", // We had to list all attributes...
            // ],
            where: {
                flag: "selesai_isi",
                ukt_tinggi: "tidak",
                // no_peserta: {
                //   [Op.in]: [4200345469, 4200482472],
                // },
            },
            include: [
                { model: Fakultas, as: "fakultas" },
                Prodi,
                Provinsi,
                Kabkot,
                Kecamatan,
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

cmahasiswa.prototype.add = function (req, atribut) {
    return new Promise(function (resolve, reject) {
        CMahasiswa.create(
            {
                no_peserta: req.no_peserta,
                nama_cmahasiswa: req.nama_cmahasiswa,
                bidik_misi_cmahasiswa: req.bidik_misi_cmahasiswa,
                fakultas_cmahasiswa: req.fakultas_cmahasiswa,
                prodi_cmahasiswa: req.prodi_cmahasiswa,
                jalur_cmahasiswa: req.jalur_cmahasiswa,
                sosmed_cmahasiswa: req.sosmed_cmahasiswa,
                alamat_cmahasiswa: req.alamat_cmahasiswa,
                provinsi_cmahasiswa: req.provinsi_cmahasiswa,
                kabkot_cmahasiswa: req.kabkot_cmahasiswa,
                kecamatan_cmahasiswa: req.kecamatan_cmahasiswa,
                gender_cmahasiswa: req.gender_cmahasiswa,
                telepon_cmahasiswa: req.telepon_cmahasiswa,
                goldar_cmahasiswa: req.goldar_cmahasiswa,
                tempat_lahir_cmahasiswa: req.tempat_lahir_cmahasiswa,
                tanggal_lahir_cmahasiswa: req.tanggal_lahir_cmahasiswa,
                foto_cmahasiswa: req.foto_cmahasiswa,
                penghasilan_cmahasiswa: req.penghasilan_cmahasiswa,
                golongan_id: req.golongan_id,
                ukt_tinggi: req.ukt_tinggi,
                flag: req.flag,
                waktu_selesai: req.waktu_selesai,
                atribut: atribut,
                tagihan: req.tagihan,
                no_registrasi: req.no_registrasi,
                spu: req.spu,
                penalty: req.penalty,
            },
            {
                fields: [
                    "no_peserta",
                    "nama_cmahasiswa",
                    "bidik_misi_cmahasiswa",
                    "fakultas_cmahasiswa",
                    "prodi_cmahasiswa",
                    "jalur_cmahasiswa",
                    "sosmed_cmahasiswa",
                    "alamat_cmahasiswa",
                    "provinsi_cmahasiswa",
                    "kabkot_cmahasiswa",
                    "kecamatan_cmahasiswa",
                    "gender_cmahasiswa",
                    "telepon_cmahasiswa",
                    "goldar_cmahasiswa",
                    "tempat_lahir_cmahasiswa",
                    "tanggal_lahir_cmahasiswa",
                    "foto_cmahasiswa",
                    "penghasilan_cmahasiswa",
                    "golongan_id",
                    "ukt_tinggi",
                    "flag",
                    "waktu_selesai",
                    "atribut",
                    "tagihan",
                    "no_registrasi",
                    "spu",
                    "penalty",
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

cmahasiswa.prototype.edit = function (req, no_peserta, timestamp, atribut) {
    return new Promise(function (resolve, reject) {
        var data = {
            nama_cmahasiswa: req.body.nama_cmahasiswa,
            bidik_misi_cmahasiswa: req.body.bidik_misi_cmahasiswa,
            fakultas_cmahasiswa: req.body.fakultas_cmahasiswa,
            prodi_cmahasiswa: req.body.prodi_cmahasiswa,
            jalur_cmahasiswa: req.body.jalur_cmahasiswa,
            sosmed_cmahasiswa: req.body.sosmed_cmahasiswa,
            alamat_cmahasiswa: req.body.alamat_cmahasiswa,
            provinsi_cmahasiswa: req.body.provinsi_cmahasiswa,
            kabkot_cmahasiswa: req.body.kabkot_cmahasiswa,
            kecamatan_cmahasiswa: req.body.kecamatan_cmahasiswa,
            gender_cmahasiswa: req.body.gender_cmahasiswa,
            telepon_cmahasiswa: req.body.telepon_cmahasiswa,
            goldar_cmahasiswa: req.body.goldar_cmahasiswa,
            tempat_lahir_cmahasiswa: req.body.tempat_lahir_cmahasiswa,
            tanggal_lahir_cmahasiswa: req.body.tanggal_lahir_cmahasiswa,
            penghasilan_cmahasiswa: req.body.penghasilan_cmahasiswa,
            golongan_id: req.body.golongan_id,
            ukt_tinggi: req.body.ukt_tinggi,
            flag: req.body.flag,
            waktu_selesai: timestamp,
            spu: req.body.spu,
        };

        if (req.file !== undefined) {
            data.foto_cmahasiswa = req.file.filename;
        }

        CMahasiswa.update(data, {
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

cmahasiswa.prototype.addLog = function (users, executor, timestamp) {
    return new Promise(function (resolve, reject) {
        LogCMahasiswa.create(
            {
                no_peserta: users.no_peserta,
                nama_cmahasiswa: users.nama_cmahasiswa,
                bidik_misi_cmahasiswa: users.bidik_misi_cmahasiswa,
                fakultas_cmahasiswa: users.fakultas_cmahasiswa,
                prodi_cmahasiswa: users.prodi_cmahasiswa,
                jalur_cmahasiswa: users.jalur_cmahasiswa,
                sosmed_cmahasiswa: users.sosmed_cmahasiswa,
                alamat_cmahasiswa: users.alamat_cmahasiswa,
                provinsi_cmahasiswa: users.provinsi_cmahasiswa,
                kabkot_cmahasiswa: users.kabkot_cmahasiswa,
                kecamatan_cmahasiswa: users.kecamatan_cmahasiswa,
                gender_cmahasiswa: users.gender_cmahasiswa,
                telepon_cmahasiswa: users.telepon_cmahasiswa,
                goldar_cmahasiswa: users.goldar_cmahasiswa,
                tempat_lahir_cmahasiswa: users.tempat_lahir_cmahasiswa,
                tanggal_lahir_cmahasiswa: users.tanggal_lahir_cmahasiswa,
                foto_cmahasiswa: users.foto_cmahasiswa,
                penghasilan_cmahasiswa: users.penghasilan_cmahasiswa,
                golongan_id: users.golongan_id,
                ukt_tinggi: users.ukt_tinggi,
                flag: users.flag,
                waktu_selesai: users.waktu_selesai,
                atribut: users.atribut,
                tagihan: users.tagihan,
                no_registrasi: users.no_registrasi,
                executor: executor,
                timestamp: timestamp,
            },
            {
                fields: [
                    "no_peserta",
                    "nama_cmahasiswa",
                    "bidik_misi_cmahasiswa",
                    "fakultas_cmahasiswa",
                    "prodi_cmahasiswa",
                    "jalur_cmahasiswa",
                    "sosmed_cmahasiswa",
                    "alamat_cmahasiswa",
                    "provinsi_cmahasiswa",
                    "kabkot_cmahasiswa",
                    "kecamatan_cmahasiswa",
                    "gender_cmahasiswa",
                    "telepon_cmahasiswa",
                    "goldar_cmahasiswa",
                    "tempat_lahir_cmahasiswa",
                    "tanggal_lahir_cmahasiswa",
                    "foto_cmahasiswa",
                    "penghasilan_cmahasiswa",
                    "golongan_id",
                    "ukt_tinggi",
                    "flag",
                    "waktu_selesai",
                    "atribut",
                    "tagihan",
                    "no_registrasi",
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

cmahasiswa.prototype.uktTinggi = function (req, no_peserta) {
    console.log("Ini: ", req.body.golongan_id);
    return new Promise(function (resolve, reject) {
        CMahasiswa.update(
            {
                golongan_id: req.body.golongan_id,
                ukt_tinggi: "ya",
                flag: "pengisian",
            },
            {
                where: {
                    no_peserta: no_peserta,
                },
            }
        )
            .then(function (response) {
                resolve("success");
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

cmahasiswa.prototype.uktTinggiTidak = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        CMahasiswa.update(
            {
                ukt_tinggi: "tidak",
                flag: "pengisian",
            },
            {
                where: {
                    no_peserta: no_peserta,
                },
            }
        )
            .then(function (response) {
                resolve("success");
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

cmahasiswa.prototype.checkData = function (no_peserta) {
    return new Promise((resolve, reject) => {
        CMahasiswa.findOne({
            where: {
                no_peserta: no_peserta,
            },
            raw: true,
        })
            .then(function (response) {
                var result = true;
                delete response.tagihan;
                delete response.no_registrasi;
                delete response.penghasilan_cmahasiswa;
                delete response.spu;
                delete response.penalty;
                if (response.ukt_tinggi === "ya") {
                    delete response.sosmed_cmahasiswa;
                } else {
                    delete response.golongan_id;
                }
                for (var key in response) {
                    result *= response[key] !== 0 && response[key] !== "";
                }
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

cmahasiswa.prototype.selesaiIsi = (info, no_peserta, atribut = "original") => {
    return new Promise((resolve, reject) => {
        CMahasiswa.update(
            {
                flag: "selesai_isi",
                waktu_selesai: timestamp,
                tagihan: generateTagihan(info, no_peserta),
            },
            {
                where: {
                    no_peserta: no_peserta,
                    atribut: atribut,
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

cmahasiswa.prototype.cekTagihan = (no_peserta) => {
    return new Promise((resolve, reject) => {
        CMahasiswa.findOne({
            where: {
                no_peserta: no_peserta,
            },
        })
            .then((user) => {
                if (user.tagihan == "") {
                    Info.findOne()
                        .then((info) => {
                            CMahasiswa.update(
                                {
                                    tagihan: generateTagihan(info, no_peserta),
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
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    resolve(user);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

cmahasiswa.prototype.flagTerima = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        CMahasiswa.update(
            {
                flag: "terima_ukt",
            },
            {
                where: {
                    no_peserta: no_peserta,
                },
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

cmahasiswa.prototype.flagKlarifikasi = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        CMahasiswa.update(
            {
                flag: "sanggah_ukt",
            },
            {
                where: {
                    no_peserta: no_peserta,
                },
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

cmahasiswa.prototype.flagBatalKlarifikasi = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        CMahasiswa.update(
            {
                flag: "terima_ukt",
                waktu_selesai: timestamp,
            },
            {
                where: {
                    no_peserta: no_peserta,
                    // atribut: 'sanggah'
                },
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

cmahasiswa.prototype.getSanggah = function () {
    return new Promise(function (resolve, reject) {
        CMahasiswa.findAll({
            where: {
                flag: "sanggah_ukt",
            },
            include: [
                { model: Fakultas, as: "fakultas" },
                Prodi,
                Provinsi,
                Kabkot,
                Kecamatan,
                Ukt,
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

cmahasiswa.prototype.flagSelesaiKlarifikasi = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        CMahasiswa.update(
            {
                flag: "selesai_sanggah",
            },
            {
                where: {
                    no_peserta: no_peserta,
                    //atribut: 'sanggah'
                },
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

cmahasiswa.prototype.getBM = function () {
    return new Promise(function (resolve, reject) {
        CMahasiswa.findAll({
            where: {
                bidik_misi_cmahasiswa: "Ya",
            },
            include: [
                { model: Fakultas, as: "fakultas" },
                Prodi,
                Provinsi,
                Kabkot,
                Kecamatan,
                Ukt,
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

cmahasiswa.prototype.getCmahasiswa = (no_peserta) => {
    return new Promise((resolve, reject) => {
        CMahasiswa.findOne({
            where: {
                no_peserta: no_peserta,
                atribut: "sanggah",
            },
            include: [
                { model: Fakultas, as: "fakultas" },
                Prodi,
                Provinsi,
                Kabkot,
                Kecamatan,
            ],
        })
            .then((users) => {
                if (users) {
                    resolve(users);
                } else {
                    CMahasiswa.findOne({
                        where: {
                            no_peserta: no_peserta,
                        },
                        include: [
                            { model: Fakultas, as: "fakultas" },
                            Prodi,
                            Provinsi,
                            Kabkot,
                            Kecamatan,
                        ],
                    }).then((users) => {
                        if (users) {
                            resolve(users);
                        } else {
                            resolve({ msg: "data tidak ditemukan" });
                        }
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

cmahasiswa.prototype.dashboardSummary = function () {
    var getdates = function (callback) {
        db.query(
            `SELECT
                cast(a.waktu_selesai as date) as date,
                case
                    when b.count_mulai is null then 0
                    else b.count_mulai
                end as count_mulai,
                case
                    when c.count_selesai is null then 0
                    else c.count_selesai
                end as count_selesai
            from
                tb_cmahasiswa a
            left join (
                SELECT
                    count(id_cmahasiswa) as count_mulai,
                    cast(waktu_mulai as date) as waktu_mulai
                FROM
                    tb_cmahasiswa
                where no_peserta not like '%fulan%'
                GROUP BY
                    cast(waktu_mulai as date) ) as b on
                cast(a.waktu_selesai as date) = b.waktu_mulai
            left join (
                SELECT
                    count(id_cmahasiswa) as count_selesai,
                    cast(waktu_selesai as date) as waktu_selesai
                FROM
                    tb_cmahasiswa
                where no_peserta not like '%fulan%'
                GROUP BY
                    cast(waktu_selesai as date) ) as c on
                cast(a.waktu_selesai as date) = c.waktu_selesai
            group by
                cast(waktu_selesai as date)`,
            { type: db.QueryTypes.SELECT }
        ).then((rows) => {
            finish(rows, callback);
        });
    };
    var finish = function (lastData, callback) {
        var fData = {};
        fData.fields = [];
        fData.startDates = [];
        fData.endDates = [];
        for (i of lastData) {
            fData.fields.push(i.date);
            fData.startDates.push(i.count_mulai);
            fData.endDates.push(i.count_selesai);
        }
        callback.fin(fData);
    };
    return new Promise((res, rej) => {
        getdates({
            fin: function (data) {
                res(data);
            },
            err: function (err) {
                rej(err);
            },
        });
    });
};

cmahasiswa.prototype.dashboardmeta = function () {
    var getFakData = function (callback) {
        db.query(
            `select
                a.fakultas_cmahasiswa,
                count_all,
                count_mulai,
                count_pengisian,
                count_selesai,
                d.nama
            from
                tb_cmahasiswa a
            left join (
                select
                    fakultas_cmahasiswa,
                    sum(case when flag <> 'pengisian' then 0 else 1 end) as count_pengisian
                from
                    tb_cmahasiswa
                where no_peserta not like '%fulan%'
                group by
                    fakultas_cmahasiswa ) as b on
                a.fakultas_cmahasiswa = b.fakultas_cmahasiswa
            left join (
                select
                    fakultas_cmahasiswa,
                    sum(case when (flag <> 'selesai_isi' and flag <> 'terima_ukt') then 0 else 1 end) as count_selesai
                from
                    tb_cmahasiswa
                where no_peserta not like '%fulan%'
                group by
                    fakultas_cmahasiswa ) as c on
                a.fakultas_cmahasiswa = c.fakultas_cmahasiswa
            left join ref_fakultas d on
                a.fakultas_cmahasiswa = d.kode
            left join (
                select
                    count(id_cmahasiswa) as count_all,
                    fakultas_cmahasiswa
                from
                    tb_cmahasiswa
                where no_peserta not like '%fulan%'
                group by
                    fakultas_cmahasiswa) as e on
                a.fakultas_cmahasiswa = e.fakultas_cmahasiswa
            left join (
                select
                    fakultas_cmahasiswa,
                    sum(case when waktu_mulai = 0 then 0 else 1 end) as count_mulai
                from
                    tb_cmahasiswa
                where no_peserta not like '%fulan%'
                group by
                    fakultas_cmahasiswa ) as f on
                a.fakultas_cmahasiswa = f.fakultas_cmahasiswa
            group by
                a.fakultas_cmahasiswa`,
            { type: db.QueryTypes.SELECT }
        )
            .then((rows) => {
                var data = [];
                console.log(rows);
                for (const i of rows) {
                    data.push({
                        fakultas: i.nama,
                        countMulai: i.count_mulai,
                        countPengisian: i.count_pengisian,
                        countSelesai: i.count_selesai,
                        countTerima: i.count_terima,
                        countAll: i.count_all,
                    });
                }
                console.log(data);
                callback.fin(data);
            })
            .catch((err) => {
                callback.err(err);
            });
    };
    return new Promise((resolve, reject) => {
        getFakData({
            fin: function (data) {
                resolve(data);
            },
            err: function (data) {
                reject(data);
            },
        });
    });
};

module.exports = cmahasiswa;
