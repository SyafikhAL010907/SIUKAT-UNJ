var Sequelize = require('sequelize')
var db = require('../config/database')

const LogAyah = db.define('log_ayah', {
  id_log_ayah:{
  	type: Sequelize.INTEGER,
  	primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  status_ayah: {
    type: Sequelize.ENUM('hidup', 'wafat')
  },
  nama_ayah: {
    type: Sequelize.STRING
  },
  nik_ayah: {
    type: Sequelize.STRING
  },
  telepon_ayah: {
    type: Sequelize.STRING
  },
  alamat_ayah: {
    type: Sequelize.STRING
  },
  provinsi_ayah: {
    type: Sequelize.INTEGER
  },
  kabkot_ayah: {
    type: Sequelize.INTEGER
  },
  kecamatan_ayah: {
    type: Sequelize.INTEGER
  },
  pekerjaan_ayah: {
    type: Sequelize.CHAR
  },
  penghasilan_ayah: {
    type: Sequelize.INTEGER
  },
  sampingan_ayah: {
    type: Sequelize.INTEGER
  },
  scan_ktp_ayah: {
    type: Sequelize.STRING
  },
  scan_slip_ayah: {
    type: Sequelize.STRING
  },
  tempat_lahir_ayah: {
    type: Sequelize.STRING
  },
  tanggal_lahir_ayah: {
    type: Sequelize.DATEONLY
  },
  atribut: {
    type: Sequelize.ENUM('original', 'sanggah')
  },
  executor: {
    type: Sequelize.STRING
  },
  timestamp: {
    type: Sequelize.DATE
  }
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
  tableName: 'log_ayah'
}
);
module.exports = LogAyah
