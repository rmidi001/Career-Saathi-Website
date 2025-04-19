const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // or your MySQL username
  password: 'your_mysql_password', // 👈 use the one you set during setup
  database: 'career_saathi'
});

connection.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL DB');
});

module.exports = connection;
