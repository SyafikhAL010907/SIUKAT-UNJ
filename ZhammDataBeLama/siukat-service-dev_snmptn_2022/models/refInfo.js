var Sequelize = require('sequelize')
var db = require('../config/database')

const RefInfo = db.define('ref_info', {
    kode: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    tanggal_mulai: {
        type: Sequelize.DATE
    },

    tanggal_selesai: {
        type: Sequelize.DATE
    },

    pengisian: {
        type: Sequelize.STRING
    },

    pengumuman: {
        type: Sequelize.STRING
    },

    klarifikasi_tanggal: {
        type: Sequelize.STRING
    },

    klarifikasi_lokasi: {
        type: Sequelize.STRING
    },

    pembayaran: {
        type: Sequelize.STRING
    },

    lapor_diri: {
        type: Sequelize.STRING
    },

    kontak: {
        type: Sequelize.STRING
    },

    stage: {
        type: Sequelize.ENUM("snmptn", "sbmptn", "mandiri")
    },

    stage_detail: {
        type: Sequelize.ENUM("snmptn", "sbmptn", "mandiri", "japres")
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
        tableName: 'ref_info'
    }
);
module.exports = RefInfo
