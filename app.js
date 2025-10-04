const express = require("express");
const app = express();
const port = 5000;
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();
//import db
const mysqlconnection = require("./db/dbconfig");

//import Routes middleware
const userRoutes = require("./Routes/userRoutes");
const questionRoutes = require("./Routes/questionRoute");
const answerRoutes = require("./Routes/answerRoutes");
const askgpt = require("./Routes/questionRoute");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middle-ware
app.use("/api/user", userRoutes);
app.use("/api/questions", authMiddleware, questionRoutes);
app.use("/api/answer", authMiddleware, answerRoutes);
app.use("/api/chatgpt", askgpt);

// Simple route to test
app.get("/", (req, res) => {
  res.send(`<h1>Response is sent successfully</h1>`);
});

//connection test

const start = async () => {
  try {
    const result = await mysqlconnection.execute("select 'test'");
    // console.log(result);
    //Listen on port
    await app.listen(port);
    console.log("database successfully established");
  } catch (err) {
    console.log(err.message);
  }
};
start();

// app.listen(port, (err) => {
//   console.log("connected http://localhost:5000");
// })
