var Sequelize = require("sequelize");
var db = require("../config/database");

const DataSekolah = db.define(
  "data_sekolah",
  {
    npsn: {
      type: Sequelize.CHAR,
      primaryKey: true,
    },
    nama_sekolah: {
      type: Sequelize.STRING,
    },
    jenis_sekolah: {
      type: Sequelize.STRING,
    },
    nama_kabupaten: {
      type: Sequelize.STRING,
    },
    nama_provinsi: {
      type: Sequelize.STRING,
    },
    akreditasi_sekolah: {
      type: Sequelize.STRING,
    },
    kepemilikan: {
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
    tableName: "data_sekolah",
  }
);

module.exports = DataSekolah;
