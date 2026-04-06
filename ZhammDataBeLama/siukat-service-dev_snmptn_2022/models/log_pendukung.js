var Sequelize = require('sequelize')
var db = require('../config/database')

const LogPendukung = db.define('log_pendukung', {
  id_log_pendukung:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  tanggungan: {
    type: Sequelize.INTEGER
  },
  scan_pernyataan_ukt_tinggi: {
    type: Sequelize.STRING
  },
  scan_pernyataan_kebenaran: {
    type: Sequelize.STRING
  },
  scan_kk: {
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
  tableName: 'log_pendukung'
}
);
module.exports = LogPendukung
