const { request } = require("express");
const mysql2 = require("mysql2");
r;

const mysqlconnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: DB_DATABASE,
  host: DB_HOST,
  password: DB_PASSWORD,
  connectionLimit: DB_CONNECTION_LIMIT,
});

mysqlconnection.getConnection("SELECT 1", (err, result) => {
  if (err) {
    console.log("Connection error:", err.message);
  } else {
    console.log("Connected successfully:", result);
  }
});
