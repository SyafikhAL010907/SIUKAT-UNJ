var Sequelize = require('sequelize')
var db = require('../config/database')

const Bobot = db.define('bobot', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    a:{
        type: Sequelize.DECIMAL
    },
    b:{
        type: Sequelize.DECIMAL
    },
    c:{
        type: Sequelize.DECIMAL
    },
    d:{
        type: Sequelize.DECIMAL
    },
    e:{
        type: Sequelize.DECIMAL
    },
    pbb:{
        type: Sequelize.DECIMAL
    },
    kontrak:{
        type: Sequelize.DECIMAL
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
  tableName: 'ref_bobot'
}
);
module.exports = Bobot
