const mysql = require('mysql2');

const requiredEnvironmentVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const variable of requiredEnvironmentVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} must be set in the .env file before starting the app.`);
  }
}

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = connection;
