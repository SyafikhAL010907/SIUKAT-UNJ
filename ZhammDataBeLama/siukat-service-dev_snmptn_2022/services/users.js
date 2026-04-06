var CMahasiswa = require("../models/cmahasiswa");
var BioCMahasiswa = require("../models/bio_cmahasiswa");
var Admin = require("../models/admin");
var User = require("../models/user");
var Fakultas = require("../models/fakultas");
var Prodi = require("../models/prodi");
var Provinsi = require("../models/provinsi");
var Kabkot = require("../models/kabkot");
var Kecamatan = require("../models/kecamatan");

var users = function () { };

users.prototype.getUser = function (no_peserta) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            where: {
                no_peserta: no_peserta
            }
        }).then(function (response) {
            if (response.role === "admin") {
                Admin.findOne({
                    where: {
                        username: no_peserta
                    }
                }).then(admin => {
                    resolve(admin);
                }).catch(function (err) {
                    reject(err);
                });
            } else {
                CMahasiswa.findOne({
                    where: {
                        no_peserta: no_peserta,
                        atribut: "sanggah"
                    }, include: [
                        { model: Fakultas, as: "fakultas" },
                        Prodi, Provinsi, Kabkot, Kecamatan]
                }).then(users => {
                    if (users) {
                        console.log({ users1: users.dataValues });
                        resolve(users.dataValues);
                    } else {
                        return CMahasiswa.findOne({
                            where: {
                                no_peserta: no_peserta,
                                atribut: "original"
                            }, include: [
                                { model: Fakultas, as: "fakultas" },
                                Prodi, Provinsi, Kabkot, Kecamatan, BioCMahasiswa]
                        });
                    }
                }).then(users => {
                    if (users) {
                        console.log({ users: users.BioCMahasiswa });
                        resolve(users.dataValues);
                    } else {
                        reject(err);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        }).catch(function (err) {
            reject(err);
        });

        //
    });
};

module.exports = users;
