const express = require("express");
const port = 5500;

const app = express();
app.use(express.json());


//  register rout
app.post("/api/users/register", (req, res)=>{
    res.send("register user")
})

app.post("/api/users/login", (req, res) => {
  res.send("login  user");
});

app.get("/api/users/check", (req, res) => {
  res.send("checked user");
});



app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`listening on ${port}`);
  }
});
