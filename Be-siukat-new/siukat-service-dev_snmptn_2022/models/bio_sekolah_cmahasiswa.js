var Sequelize = require("sequelize");
var db = require("../config/database");

// var Agama = require("./bio_ref_agama");
var Jurusan = require("./bio_ref_jurusan");
// var Pekerjaan = require("./bio_ref_pekerjaan");
// var Pendidikan = require("./bio_ref_pendidikan");
// var Penghasilan = require("./bio_ref_penghasilan");
// var Tinggal = require("./bio_ref_tinggal");
// var Transportasi = require("./bio_ref_transportasi");
var DataSekolah = require("./data_sekolah");

const BioSekolahCMahasiswa = db.define(
  "bio_sekolah_cmahasiswa",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    no_peserta: {
      type: Sequelize.STRING,
    },
    nisn: {
      type: Sequelize.CHAR,
    },
    npsn: {
      type: Sequelize.CHAR,
    },
    kode_jurusan: {
      // fk
      type: Sequelize.INTEGER,
    },
    tahun_masuk: {
      type: Sequelize.CHAR,
    },
    tahun_lulus: {
      type: Sequelize.CHAR,
    },
    rata_UN: {
      type: Sequelize.CHAR,
    },
    mapel_UN: {
      type: Sequelize.CHAR,
    },
    no_peserta_UN: {
      type: Sequelize.CHAR,
    },
    rata_ijazah: {
      type: Sequelize.CHAR,
    },
    mapel_ijazah: {
      type: Sequelize.CHAR,
    },
    no_ijazah: {
      type: Sequelize.CHAR,
    },
    alamat_sekolah: {
      type: Sequelize.CHAR,
    },
    scan_skl_ijazah: {
      type: Sequelize.CHAR,
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
    tableName: "bio_sekolah_cmahasiswa",
  }
);

BioSekolahCMahasiswa.belongsTo(Jurusan, {
  foreignKey: "kode_jurusan",
  targetKey: "jurusan_id",
});

BioSekolahCMahasiswa.belongsTo(DataSekolah, {
  foreignKey: "npsn",
  // targetKey: "npsn",
  // as: "sekolah",
});

module.exports = BioSekolahCMahasiswa;
