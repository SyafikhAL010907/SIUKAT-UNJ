var Sequelize = require("sequelize");
var db = require("../config/database");
var CMahasiswa = require("./cmahasiswa");

const User = db.define("user", {
    no_peserta: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.ENUM("cmahasiswa", "admin")
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
        tableName: "tb_user"
    }
);

User.belongsTo(CMahasiswa, {
    foreignKey: "no_peserta",
    targetKey: "no_peserta",
    as: "cmahasiswa"
});

module.exports = User;
