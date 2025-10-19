require("dotenv").config();
const mysqlconnection = require("../db/dbconfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// post question
const askQuestion = async (req, res) => {
  const { title, description, tag } = req.body;
  const userid = req.user.userid;
  const generateQuestionId = () => {
    const randomBytes = crypto.randomBytes(16);
    const uuid = uuidv4({ random: randomBytes });
    return uuid;
  };
  const questionid = generateQuestionId();
  const askQuery = `INSERT INTO questions (questionid,userid,title,description,tag) VALUES (?,?,?,?,?)`;
  try {
    await mysqlconnection.query(askQuery, [
      questionid,
      userid,
      title,
      description,
      tag,
    ]);
    return res.status(StatusCodes.CREATED).json({ msg: "Question asked!" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later!" });
  }
};

//another way to fetch all question
// Get all questions
// const getAllQuestions = async (req, res) => {
//   try {
//     const fetchQuestions = `
//       SELECT
//         questions.title,
//         questions.questionid,
//         users.username,
//         NOW() AS createdAt
//       FROM questions
//       LEFT JOIN users ON questions.userid = users.userid
//       ORDER BY questions.id DESC
//     `;

//     const [questions] = await mysqlconnection.query(fetchQuestions);

//     return res.status(StatusCodes.OK).json({ questions });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// };

const getAllQuestions = async (req, res) => {
  try {
    const fetchQuestions = `
      SELECT 
    questions.title,
    questions.questionid,
    questions.userid,
    users.username,
    NOW() AS createdAt
  FROM questions
  LEFT JOIN users ON questions.userid = users.userid
  ORDER BY questions.id DESC
    `;

    const [questions] = await mysqlconnection.query(fetchQuestions);

    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
};

// Get single question

async function getSingleQuestion(req, res) {
  try {
    const { questionid } = req.query;

    const fetchSingleQuestion = `
      SELECT 
        questions.questionid, 
        questions.title, 
        questions.description, 
        questions.userid, 
        users.username
      FROM questions
      LEFT JOIN users ON questions.userid = users.userid
      WHERE questions.questionid = ?
      ORDER BY questions.id DESC
    `;

    const [rows] = await mysqlconnection.query(fetchSingleQuestion, [
      questionid,
    ]);

    return res.status(StatusCodes.OK).json({ questions: rows });
  } catch (error) {
    console.error("Backend error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

// Edit Question
const editQuestion = async (req, res) => {
  const { questionid } = req.params;
  const { userid, title, description } = req.body;

  // Verify ownership
  const [rows] = await mysqlconnection.query(
    "SELECT * FROM questions WHERE questionid = ? AND userid = ?",
    [questionid, userid]
  );

  if (rows.length === 0)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "You can only edit your own question" });

  await mysqlconnection.query(
    "UPDATE questions SET title = ?, description = ? WHERE questionid = ?",
    [title, description, questionid]
  );

  res.json({ message: "Question updated" });
};

// Delete Question
const deleteQuestion = async (req, res) => {
  const { questionid } = req.params;
  const { userid } = req.body;

  // Verify ownership
  const [rows] = await mysqlconnection.query(
    "SELECT * FROM questions WHERE questionid = ? AND userid = ?",
    [questionid, userid]
  );

  if (rows.length === 0)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "You can only delete your own question" });

  await mysqlconnection.query("DELETE FROM questions WHERE questionid = ?", [
    questionid,
  ]);
  res.json({ message: "Question deleted" });
};

// ask GPT
const askgpt = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: question }],
    });

    const gptAnswer = response.choices[0].message.content;
    res.json({ answer: gptAnswer });
  } catch (err) {
    console.error("OpenAI error:", err);

    if (err.code === "insufficient_quota") {
      return res.status(429).json({
        error: "You exceeded your OpenAI quota. Check your plan and billing.",
      });
    }
    res.status(500).json({ error: err.message || "ChatGPT error" });
  }
};

module.exports = {
  getAllQuestions,
  askQuestion,
  askgpt,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
};
