const { request } = require("express");
const mysql2 = require("mysql2");


const mysqlconnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
});

mysqlconnection.query("SELECT 1", (err, result) => {
  if (err) {
    console.log("Query error:", err.message);
  } else {
    console.log("Query successful:", result);
  }
});
