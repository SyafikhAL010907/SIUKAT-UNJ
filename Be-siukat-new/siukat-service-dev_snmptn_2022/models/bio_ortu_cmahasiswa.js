var Sequelize = require("sequelize");
var db = require("../config/database");

// var Agama = require("./bio_ref_agama");
// var Jurusan = require('./bio_ref_jurusan')
var Pekerjaan = require("./bio_ref_pekerjaan");
var Pendidikan = require("./bio_ref_pendidikan");
var Penghasilan = require("./bio_ref_penghasilan");
// var Tinggal = require("./bio_ref_tinggal");
// var Transportasi = require("./bio_ref_transportasi");
var Wilayah = require("./bio_ref_wilayah");

const BioOrtuCMahasiswa = db.define(
  "bio_ortu_cmahasiswa",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    no_peserta: {
      type: Sequelize.STRING,
    },
    nama_ayah: {
      type: Sequelize.STRING,
    },
    nama_ibu: {
      type: Sequelize.STRING,
    },
    nama_wali: {
      type: Sequelize.STRING,
    },
    pilih_wali: {
      type: Sequelize.ENUM("ayah", "ibu", "lainnya"),
    },
    hubungan_wali: {
      type: Sequelize.STRING,
    },
    pendidikan_ayah: {
      // fk
      type: Sequelize.INTEGER,
    },
    pendidikan_ibu: {
      // fk
      type: Sequelize.INTEGER,
    },
    pendidikan_wali: {
      // fk
      type: Sequelize.INTEGER,
    },
    penghasilan_ayah: {
      // fk
      type: Sequelize.INTEGER,
    },
    penghasilan_ibu: {
      // fk
      type: Sequelize.INTEGER,
    },
    penghasilan_wali: {
      // fk
      type: Sequelize.INTEGER,
    },
    pekerjaan_ayah: {
      // fk
      type: Sequelize.INTEGER,
    },
    pekerjaan_ibu: {
      // fk
      type: Sequelize.INTEGER,
    },
    pekerjaan_wali: {
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
    kontak: {
      type: Sequelize.STRING,
    },
    nik_ayah: {
      type: Sequelize.STRING,
    },
    nik_ibu: {
      type: Sequelize.STRING,
    },
    nik_wali: {
      type: Sequelize.STRING,
    },
    tanggal_lahir_ayah: {
      type: Sequelize.DATE,
    },
    tanggal_lahir_ibu: {
      type: Sequelize.DATE,
    },
    tanggal_lahir_wali: {
      type: Sequelize.DATE,
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
    tableName: "bio_ortu_cmahasiswa",
  }
);

BioOrtuCMahasiswa.belongsTo(Pendidikan, {
  foreignKey: "pendidikan_ayah",
  targetKey: "pendidikan_id",
  as: "detail_pendidikan_ayah",
});

BioOrtuCMahasiswa.belongsTo(Pendidikan, {
  foreignKey: "pendidikan_ibu",
  targetKey: "pendidikan_id",
  as: "detail_pendidikan_ibu",
});

BioOrtuCMahasiswa.belongsTo(Pendidikan, {
  foreignKey: "pendidikan_wali",
  targetKey: "pendidikan_id",
  as: "detail_pendidikan_wali",
});

BioOrtuCMahasiswa.belongsTo(Penghasilan, {
  foreignKey: "penghasilan_ayah",
  targetKey: "penghasilan_id",
  as: "detail_penghasilan_ayah",
});

BioOrtuCMahasiswa.belongsTo(Penghasilan, {
  foreignKey: "penghasilan_ibu",
  targetKey: "penghasilan_id",
  as: "detail_penghasilan_ibu",
});

BioOrtuCMahasiswa.belongsTo(Penghasilan, {
  foreignKey: "penghasilan_wali",
  targetKey: "penghasilan_id",
  as: "detail_penghasilan_wali",
});

BioOrtuCMahasiswa.belongsTo(Pekerjaan, {
  foreignKey: "pekerjaan_ayah",
  targetKey: "pekerjaan_id",
  as: "detail_pekerjaan_ayah",
});

BioOrtuCMahasiswa.belongsTo(Pekerjaan, {
  foreignKey: "pekerjaan_ibu",
  targetKey: "pekerjaan_id",
  as: "detail_pekerjaan_ibu",
});

BioOrtuCMahasiswa.belongsTo(Pekerjaan, {
  foreignKey: "pekerjaan_wali",
  targetKey: "pekerjaan_id",
  as: "detail_pekerjaan_wali",
});

BioOrtuCMahasiswa.belongsTo(Wilayah, {
  foreignKey: "kode_provinsi",
  targetKey: "kode",
  as: "provinsi",
});

BioOrtuCMahasiswa.belongsTo(Wilayah, {
  foreignKey: "kode_kabkot",
  targetKey: "kode",
  as: "kabkot",
});

BioOrtuCMahasiswa.belongsTo(Wilayah, {
  foreignKey: "kode_kecamatan",
  targetKey: "kode",
  as: "kecamatan",
});

module.exports = BioOrtuCMahasiswa;
