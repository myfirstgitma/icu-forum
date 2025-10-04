const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  askQuestion,
  getSingleQuestion,
} = require("../Controller/questionController");

// post question
router.post("/ask-question", askQuestion);
// get all questions
router.get("/all-questions", getAllQuestions);
// get single question
router.get("/question", getSingleQuestion);

module.exports = router;
