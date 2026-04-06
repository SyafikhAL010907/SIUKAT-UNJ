var Sequelize = require('sequelize')
var db = require('../config/database')

const LogCMahasiswa = db.define('log_cmahasiswa', {
  id_log_cmahasiswa:{
  	type: Sequelize.INTEGER,
  	primaryKey: true
  },
  no_peserta: {
    type: Sequelize.STRING
  },
  nama_cmahasiswa: {
    type: Sequelize.STRING
  },
  bidik_misi_cmahasiswa: {
    type: Sequelize.STRING
  },
  fakultas_cmahasiswa: {
    type: Sequelize.INTEGER
  },
  prodi_cmahasiswa: {
    type: Sequelize.INTEGER
  },
  jalur_cmahasiswa: {
    type: Sequelize.CHAR
  },
  sosmed_cmahasiswa: {
    type: Sequelize.STRING
  },
  alamat_cmahasiswa: {
    type: Sequelize.STRING
  },
  provinsi_cmahasiswa: {
    type: Sequelize.INTEGER
  },
  kabkot_cmahasiswa: {
    type: Sequelize.INTEGER
  },
  kecamatan_cmahasiswa: {
    type: Sequelize.INTEGER
  },
  gender_cmahasiswa: {
    type: Sequelize.ENUM('laki-laki', 'perempuan')
  },
  telepon_cmahasiswa: {
    type: Sequelize.STRING
  },
  goldar_cmahasiswa: {
    type: Sequelize.STRING
  },
  tempat_lahir_cmahasiswa: {
    type: Sequelize.STRING
  },
  tanggal_lahir_cmahasiswa: {
    type: Sequelize.DATEONLY
  },
  foto_cmahasiswa: {
    type: Sequelize.STRING
  },
  penghasilan_cmahasiswa: {
    type: Sequelize.INTEGER
  },
  golongan_id: {
    type: Sequelize.INTEGER
  },
  ukt_tinggi: {
    type: Sequelize.ENUM('ya', 'tidak')
  },
  flag: {
    type: Sequelize.ENUM('belum_login','pengisian','selesai_isi','pengumuman','terima_ukt','sanggah_ukt','selesai_sanggah')
  },
  waktu_selesai: {
    type: Sequelize.DATE
  },
  atribut: {
    type: Sequelize.ENUM('original','sanggah')
  },
  tagihan: {
    type: Sequelize.STRING
  },
  no_registrasi: {
    type: Sequelize.STRING
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
  tableName: 'log_cmahasiswa'
}
);
module.exports = LogCMahasiswa
