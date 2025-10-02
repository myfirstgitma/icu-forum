const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();
const answerRoutes = require('./Routes/answerRouts');

app.use(express.json());

// Simple route to test
app.get("/", (req, res) => {
  res.send(`<h1>Response is sent successfully</h1>`);
});


// --- Route Integration ---
// When a request hits '/api/answer', use the answerRoutes module
app.use("/api/answer", answerRoutes); 


// Listen on port
app.listen(port, () => {
  console.log(`Server running on port ${port},http://localhost:5000`);
});