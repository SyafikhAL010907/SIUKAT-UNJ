var Sequelize = require("sequelize");
var db = require("../config/database");

const Verifikasi = db.define(
  "verifikasi",
  {
    id_verifikasi: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    no_peserta: {
      type: Sequelize.INTEGER,
    },
    ver_akademik: {
      type: Sequelize.ENUM("lolos", "tidak_lolos", "belum_verifikasi"),
    },
    ket_akademik: {
      type: Sequelize.STRING,
    },
    ver_bidik_misi: {
      type: Sequelize.ENUM("lolos", "tidak_lolos", "belum_verifikasi"),
    },
    ket_bidik_misi: {
      type: Sequelize.STRING,
    },
    ver_keterampilan: {
      type: Sequelize.ENUM("lolos", "tidak_lolos", "belum_verifikasi"),
    },
    ket_keterampilan: {
      type: Sequelize.STRING,
    },
    ver_kjmu: {
      type: Sequelize.ENUM("lolos", "tidak_lolos", "belum_verifikasi"),
    },
    ket_kjmu: {
      type: Sequelize.STRING,
    },
    ver_kipk: {
      type: Sequelize.ENUM("lolos", "tidak_lolos", "belum_verifikasi"),
    },
    ket_kipk: {
      type: Sequelize.STRING,
    },
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,

    // define the table's name
    tableName: "tb_verifikasi",
  }
);
module.exports = Verifikasi;
