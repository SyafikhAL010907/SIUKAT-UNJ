var Sequelize = require('sequelize')
var db = require('../config/database')

const LogKendaraan = db.define('log_kendaraan', {
  id_log_kendaraan:{
  	type: Sequelize.INTEGER,
  	primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  status_motor: {
    type: Sequelize.ENUM('memiliki', 'tidak_memiliki')
  },
  jumlah_motor: {
    type: Sequelize.INTEGER
  },
  pajak_motor: {
    type: Sequelize.INTEGER
  },
  scan_motor: {
    type: Sequelize.STRING
  },
  status_mobil: {
    type: Sequelize.ENUM('memiliki', 'tidak_memiliki')
  },
  jumlah_mobil: {
    type: Sequelize.INTEGER
  },
  pajak_mobil: {
    type: Sequelize.INTEGER
  },
  scan_mobil: {
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
  tableName: 'log_kendaraan'
}
);
module.exports = LogKendaraan
