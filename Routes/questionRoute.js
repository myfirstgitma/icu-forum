const express = require("express");
const router = express.Router();
const { getAllQuestions } = require("../Controller/questionController");

router.get("/question", getAllQuestions);

module.exports = router;
