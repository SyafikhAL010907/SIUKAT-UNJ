var Sequelize = require("sequelize");
var db = require("../config/database");

var Agama = require("./bio_ref_agama");
// var Jurusan = require('./bio_ref_jurusan')
// var Pekerjaan = require('./bio_ref_pekerjaan')
// var Pendidikan = require('./bio_ref_pendidikan')
// var Penghasilan = require('./bio_ref_penghasilan')
var Tinggal = require("./bio_ref_tinggal");
var Transportasi = require("./bio_ref_transportasi");
var Wilayah = require("./bio_ref_wilayah");

const BioCMahasiswa = db.define(
  "bio_cmahasiswa",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    no_peserta: {
      type: Sequelize.STRING,
    },
    nama: {
      type: Sequelize.STRING,
    },
    tempat_lahir_cmahasiswa: {
      type: Sequelize.STRING,
    },
    tanggal_lahir_cmahasiswa: {
      type: Sequelize.DATE,
    },
    jenis_kelamin: {
      type: Sequelize.ENUM("laki-laki", "perempuan"),
    },
    kode_agama: {
      // fk
      type: Sequelize.INTEGER,
    },
    alamat: {
      type: Sequelize.STRING,
    },
    rt: {
      type: Sequelize.CHAR,
    },
    rw: {
      type: Sequelize.CHAR,
    },
    kelurahan: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    kode_pos: {
      type: Sequelize.CHAR,
    },
    kode_provinsi: {
      // fk
      type: Sequelize.INTEGER,
    },
    kode_kabkot: {
      // fk
      type: Sequelize.INTEGER,
    },
    kode_kecamatan: {
      // fk
      type: Sequelize.INTEGER,
    },
    nik: {
      type: Sequelize.STRING,
    },
    npwp: {
      type: Sequelize.STRING,
    },
    kewarganegaraan: {
      type: Sequelize.ENUM("WNI", "WNA"),
    },
    dusun: {
      type: Sequelize.STRING,
    },
    kode_tinggal: {
      // fk
      type: Sequelize.INTEGER,
    },
    kode_transportasi: {
      // fk
      type: Sequelize.INTEGER,
    },
    telp: {
      type: Sequelize.STRING,
    },
    hp: {
      type: Sequelize.STRING,
    },
    terima_kps: {
      type: Sequelize.ENUM("0", "1"),
    },
    no_kps: {
      type: Sequelize.STRING,
    },
    flag_lengkap: {
      type: Sequelize.ENUM("0", "1"),
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
    tableName: "bio_cmahasiswa",
  }
);

BioCMahasiswa.belongsTo(Agama, {
  foreignKey: "kode_agama",
  // targetKey: "agama_id",
});

BioCMahasiswa.belongsTo(Tinggal, {
  foreignKey: "kode_tinggal",
  targetKey: "tinggal_id",
});

BioCMahasiswa.belongsTo(Wilayah, {
  foreignKey: "kode_provinsi",
  targetKey: "kode",
  as: "Provinsi",
});

BioCMahasiswa.belongsTo(Wilayah, {
  foreignKey: "kode_kabkot",
  targetKey: "kode",
  as: "Kabkot",
});

BioCMahasiswa.belongsTo(Wilayah, {
  foreignKey: "kode_kecamatan",
  targetKey: "kode",
  as: "Kecamatan",
});

BioCMahasiswa.belongsTo(Transportasi, {
  foreignKey: "kode_transportasi",
  targetKey: "transportasi_id",
});

module.exports = BioCMahasiswa;
