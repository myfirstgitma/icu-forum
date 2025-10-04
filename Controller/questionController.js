require("dotenv").config();
const db = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");


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
    await dbconnection.query(askQuery, [
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
// Get all questions
const getAllQuestions = async (req, res) => {
  const sqlQuery = `
   
      SELECT questions.title,questions.questionid,Users.username FROM questions LEFT JOIN Users ON questions.userid = Users.userid order by id desc
  `;
  try {
    const [questions] = await db.execute(sqlQuery);
    res.status(200).json({
      status: "succesfull",
      count: questions.length,
      message: "question is succesfully searched",
      data: questions,
    });
  } catch (error) {
    console.error("Error:", error.message);
    //  internal error message
    res.status(500).json({
      status: "error internal",
      message: "error happened internaly: Questions can not be fetched",
      error: error.message,
    });
  }
};

// Get single question

async function getSingleQuestion(req, res) {
  // res.json({ msg: "all questions" });
  try {
    const { questionid } = req.query;
    const fetchSingleQuestion = `SELECT questions.*,Users.username FROM questions left join Users ON questions.userid=Users.userid where questionid=? order by id desc `;
    const questions = await dbconnection.query(fetchSingleQuestion, [
      questionid,
    ]);
    return res.status(StatusCodes.OK).json({ questions: questions[0] });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ msg: "something went wrong, try again later!" });
  }
}

module.exports = { getAllQuestions, askQuestion, getSingleQuestion };
