const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config(); // load env variables
//import userRoutes middleware
const userRoutes = require("./Routes/userRoutes");
//import db
const mysqlconnection = require("./db/dbconfig")
//middleware
app.use(express.json())

// Simple route to test
app.get("/", (req, res) => {
  res.send(`<h1>Response is sent successfully</h1>`);
});


//user-route middleware
app.use("/api/user", userRoutes);

//connection test

const start=async()=> {
  try {
    const result = await mysqlconnection.execute("select 'test'");
    // console.log(result);
    //Listen on port
    await app.listen(port);
    console.log("database successfully established");
  } catch (err) {
    console.log(err.message);
  }
}
start();


// app.listen(port, (err) => {
//   console.log("connected http://localhost:5000");
// })

