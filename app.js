const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config(); // load env variables

// Simple route to test
app.get("/", (req, res) => {
  res.send(`<h1>Response is sent successfully</h1>`);
});

// Listen on port
// app.listen(port, () => {
//   console.log(`Server running on port ${port},http://localhost:5000`);
// });
