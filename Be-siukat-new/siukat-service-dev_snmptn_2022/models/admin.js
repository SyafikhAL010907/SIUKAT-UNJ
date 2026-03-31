var Sequelize = require('sequelize')
var db = require('../config/database')

const Admin = db.define('admin', {
  username:{
  	type: Sequelize.STRING,
  	primaryKey: true
  },
  nama_lengkap: {
    type: Sequelize.STRING
  },
  no_telepon: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.ENUM('developer', 'operator', 'validator')
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
  tableName: 'tb_admin'
}
);
module.exports = Admin
