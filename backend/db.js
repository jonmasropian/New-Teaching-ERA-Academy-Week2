require('dotenv').config();
const mysql = require('mysql2');
 
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
 
db.connect(error => {
  if (error) {
    console.error('MySQL connection error:', error);
  } else {
    console.log('Connected to MySQL — helpdesk_db');
  }
});
 
module.exports = db;