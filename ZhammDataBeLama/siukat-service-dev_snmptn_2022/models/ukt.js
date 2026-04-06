var Sequelize = require('sequelize')
var db = require('../config/database')

const Ukt = db.define('ukt', {
  id_ukt:{
  	type: Sequelize.INTEGER,
  	primaryKey: true
  },
  major_id: {
    type: Sequelize.STRING
  },
  entrance: {
    type: Sequelize.INTEGER
  },
  semester: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.ENUM('aktif', 'nonaktif')
  },
  degree: {
    type: Sequelize.STRING
  },
  decree: {
    type: Sequelize.STRING
  },
  I: {
    type: Sequelize.INTEGER
  },
  II: {
    type: Sequelize.INTEGER
  },
  III: {
    type: Sequelize.INTEGER
  },
  IV: {
    type: Sequelize.INTEGER
  },
  V: {
    type: Sequelize.INTEGER
  },
  VI: {
    type: Sequelize.INTEGER
  },
  VII: {
    type: Sequelize.INTEGER
  },
  VIII: {
    type: Sequelize.INTEGER
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
  tableName: 'ref_ukt'
}
);
module.exports = Ukt
