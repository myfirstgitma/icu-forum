const express = require("express");
const port = 5000;
const questionRoutes = require("./Routes/questionRoute");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API! This is the default route.",
  });
});

//  question routes middle-ware
app.use("/api/questions", questionRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`listening on ${port}`);
  }
});
