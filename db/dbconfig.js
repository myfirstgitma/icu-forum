
const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: "evangadi-fourm",
  database: "evangadi_db",
  host: "localhost",
  password: "water12345",
  connectionLimit: 10,
});

dbConnection.execute("SELECT 1", (err, result) => {
  if (err) {
    console.log("Connection error:", err.message);
  } else {
    console.log("Connected successfully:", result);
  }
});
