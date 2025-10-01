const express = require("express");
const router = express.Router();
const {getquestion,askquestion,getsinglequestion}=require("../Controller/questionController")

router.post("/question",getquestion);
router.post("/question", askquestion);
router.post("/question", getsinglequestion);

 

module.exports = router;
