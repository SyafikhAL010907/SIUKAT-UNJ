var Sequelize = require('sequelize')
var db = require('../config/database')

const Rumah = db.define('rumah', {
  id_rumah:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  status_kepemilikan: {
    type: Sequelize.ENUM('milik_sendiri','bersama_saudara','kontrak','menumpang')
  },
  luas_tanah: {
    type: Sequelize.STRING
  },
  luas_bangunan: {
    type: Sequelize.STRING
  },
  status_sertifikat: {
    type: Sequelize.ENUM('hak_milik','hak_guna_bangunan','tanpa_sertifikat','tanah_girik','lainnya')
  },
  biaya_pbb: {
    type: Sequelize.INTEGER
  },
  scan_pbb: {
    type: Sequelize.STRING
  },
  biaya_kontrak: {
    type: Sequelize.INTEGER
  },
  scan_kontrak: {
    type: Sequelize.STRING
  },
  jumlah_kepala_keluarga: {
    type: Sequelize.INTEGER
  },
  atribut: {
    type: Sequelize.ENUM('original', 'sanggah')
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
  tableName: 'tb_rumah'
}
);
module.exports = Rumah
