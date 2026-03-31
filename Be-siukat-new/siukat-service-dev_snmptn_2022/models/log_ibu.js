var Sequelize = require('sequelize')
var db = require('../config/database')

const LogIbu = db.define('log_ibu', {
  id_log_ibu:{
  	type: Sequelize.INTEGER,
  	primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  status_ibu: {
    type: Sequelize.ENUM('hidup', 'wafat')
  },
  nama_ibu: {
    type: Sequelize.STRING
  },
  nik_ibu: {
    type: Sequelize.STRING
  },
  telepon_ibu: {
    type: Sequelize.STRING
  },
  alamat_ibu: {
    type: Sequelize.STRING
  },
  provinsi_ibu: {
    type: Sequelize.INTEGER
  },
  kabkot_ibu: {
    type: Sequelize.INTEGER
  },
  kecamatan_ibu: {
    type: Sequelize.INTEGER
  },
  pekerjaan_ibu: {
    type: Sequelize.CHAR
  },
  penghasilan_ibu: {
    type: Sequelize.INTEGER
  },
  sampingan_ibu: {
    type: Sequelize.INTEGER
  },
  scan_ktp_ibu: {
    type: Sequelize.STRING
  },
  scan_slip_ibu: {
    type: Sequelize.STRING
  },
  tempat_lahir_ibu: {
    type: Sequelize.STRING
  },
  tanggal_lahir_ibu: {
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
  tableName: 'log_ibu'
}
);
module.exports = LogIbu
