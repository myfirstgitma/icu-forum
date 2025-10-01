const express = require("express");
const router = express.Router();
const {getAllQuestions}=require("../Controller/questionController")

router.get("/question",getAllQuestions);
// router.post("/question", askquestion);
// router.post("/question", getsinglequestion);

 

module.exports = router;
