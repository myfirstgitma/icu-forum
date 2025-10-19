const mysql2 = require("mysql2");

// Create connection pool
const mysqlconnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
});

// Test the connection

mysqlconnection.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("The connection is successful");
    connection.release(); // release back to pool
  }
});
module.exports = mysqlconnection.promise();
