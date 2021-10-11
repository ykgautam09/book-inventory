const mysql = require('mysql2');
const {Sequelize} = require('sequelize');
require('dotenv').config();

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
});

// db native connection
dbConnection.connect((err) => {
    if (err) {
        console.log('Error connecting', err);
        return;
    }
    console.log('connected as id ' + dbConnection.threadId);
})

// sequelize connection
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

// test Sequelize connection
async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

checkConnection().then()

module.exports = {
    connection: sequelize,
    native: dbConnection
};