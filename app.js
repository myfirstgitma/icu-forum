const express = require("express");
const questionRoutes = require("./Routes/questionRoute");

//  question routes middle-ware
app.use("/api/questions", questionRoutes);

const app = express();
const port = 5000;
require("dotenv").config();
//import db
const mysqlconnection = require("./db/dbconfig")
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/answer", answerRoutes); 

// Simple route to test
app.get("/", (req, res) => {
  res.send(`<h1>Response is sent successfully</h1>`);
});


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

