var Sequelize = require('sequelize')
var db = require('../config/database')

const Keringanan = db.define('keringanan', {
    id_keringanan: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    no_peserta: {
        type: Sequelize.STRING
    },
    scan_keringanan: {
        type: Sequelize.STRING
    },
    flag: {
        type: Sequelize.ENUM('menunggu', 'ditolak', 'diterima')
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
        tableName: 'tb_keringanan'
    }
);
module.exports = Keringanan
