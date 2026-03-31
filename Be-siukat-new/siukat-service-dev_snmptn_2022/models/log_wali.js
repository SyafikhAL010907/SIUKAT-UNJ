var Sequelize = require('sequelize')
var db = require('../config/database')

const LogWali = db.define('log_wali', {
  id_log_wali:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  status_wali: {
    type: Sequelize.ENUM('ada', 'tidak')
  },
  nama_wali: {
    type: Sequelize.STRING
  },
  alamat_wali: {
    type: Sequelize.STRING
  },
  provinsi_wali: {
    type: Sequelize.INTEGER
  },
  kabkot_wali: {
    type: Sequelize.INTEGER
  },
  kecamatan_wali: {
    type: Sequelize.INTEGER
  },
  kesanggupan_wali: {
    type: Sequelize.INTEGER
  },
  scan_wali: {
    type: Sequelize.STRING
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
  tableName: 'log_wali'
}
);
module.exports = LogWali
