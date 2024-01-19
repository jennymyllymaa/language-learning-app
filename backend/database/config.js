const mysql = require("mysql");
require("dotenv").config({ path: "./.env" });

/**
 * MySQL connection configuration.
 * @typedef {Object} MysqlConfig
 * @property {string} host - The MySQL host.
 * @property {string} user - The MySQL user.
 * @property {string} password - The MySQL user's password.
 * @property {string} database - The MySQL database name.
 */
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

/**
 * Created MySQL connection instance.
 * @type {MysqlConfig}
 */
const connection = mysql.createConnection(config);

/**
 * Exported MySQL connection instance.
 * @module
 */
module.exports = connection;
