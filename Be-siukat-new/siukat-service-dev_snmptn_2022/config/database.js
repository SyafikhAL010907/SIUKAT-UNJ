require("dotenv").config();

const Sequelize = require("sequelize");

const { DB_HOST, DB_USER, DB_NAME, DB_PASS } = process.env;

//const sequelize = new Sequelize('mysql://root:@192.168.4.91/ukt_2019_snmptn');
// const sequelize = new Sequelize("ukt_2020_snmptn", DB_USER, "B248b2a", {
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    // host: '192.168.4.91',
    host: DB_HOST,
    dialect: "mysql",
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

module.exports = sequelize;
