var Sequelize = require('sequelize')
var db = require('../config/database')

const Value = db.define('value', {
  id_value:{
  	type: Sequelize.INTEGER,
  	primaryKey: true
  },
  no_peserta: {
    type: Sequelize.INTEGER
  },
  v1: {
    type: Sequelize.INTEGER
  },
  v2: {
    type: Sequelize.INTEGER
  },
  v3: {
    type: Sequelize.INTEGER
  },
  v4: {
    type: Sequelize.INTEGER
  },
  v5: {
    type: Sequelize.INTEGER
  },
  av1: {
    type: Sequelize.INTEGER
  },
  bv2: {
    type: Sequelize.INTEGER
  },
  cv3: {
    type: Sequelize.INTEGER
  },
  dv4: {
    type: Sequelize.INTEGER
  },
  ev5: {
    type: Sequelize.INTEGER
  },
  ikb: {
    type: Sequelize.INTEGER
  },
  atribut: {
    type: Sequelize.ENUM('original', 'sanggah')
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
  tableName: 'tb_value'
}
);
module.exports = Value
