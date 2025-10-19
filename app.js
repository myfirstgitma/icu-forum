require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

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
app.use(cors());

// routes middle-ware is here
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
