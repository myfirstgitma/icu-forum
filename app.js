
const express = require("express");
const port = 5500;
const questionRoutes = require("./Routes/questionRoute");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API! This is the default route.",
     
  });
});


//  question routes middle-ware
app.use("/api/user", questionRoutes);

// Register routes
// app.post("/api/users/register", (req, res) => {
//   res.send("register user");
// });

// app.post("/api/users/login", (req, res) => {
//   res.send("login user");
// });

// app.get("/api/users/check", (req, res) => {
//   res.send("checked user");
// });

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`listening on ${port}`);
  }
});
