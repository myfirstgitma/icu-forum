const mysqlconnection = require("../db/dbconfig");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

//post answer
// const postAnswer = asyncHandler(async (req, res) => {
//   // console.log(req.body);
// const { userid, answer } = req.body;
// const { questionid } = req.params;

//   // Error Handling for missing answers ---
//   if (!answer || !questionid) {
//     res.status(StatusCodes.BAD_REQUEST);
//     throw new Error("Question ID and answer text are required.");
//   }

//   // Check if the question exists
//   const [questionRows] = await mysqlconnection.query(
//     "SELECT questionid FROM questions WHERE questionid = ?",
//     [questionid]
//   );

//   if (questionRows.length === 0) {
//     res.status(StatusCodes.NOT_FOUND);
//     throw new Error("Question not found with the provided ID.");
//   }

//   try {
//     // SQL query to insert the new answer
//     const insertQuery = `INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)`;

//     const [result] = await mysqlconnection.query(insertQuery, [
//       userid,
//       questionid,
//       answer,
//     ]);

//     //  Response Handling (201 Created) ---
//     if (result.affectedRows === 1) {
//       res.status(StatusCodes.CREATED).json({
//         message: "Answer submitted successfully",
//         answer: {
//           answerid: result.insertId,
//           userid: userid,
//           questionid: questionid,
//           answer: answer,
//         },
//       });
//     } else {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR);
//       throw new Error("Failed to save the answer in the database.");
//     }
//   } catch (error) {
//     // If a foreign key constraint fails (though covered by the check above)  or another DB error occurs.
//     console.error("Database error while posting answer:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR);
//     throw new Error("Server error while saving answer.");
//   }
// });
const postAnswer = asyncHandler(async (req, res) => {
  const { userid, answer } = req.body;
  const { questionid } = req.params; // <-- take from URL

  if (!answer || !questionid || !userid) {
    res.status(400);
    throw new Error("Question ID, user ID, and answer text are required.");
  }

  // Check if question exists
  const [questionRows] = await mysqlconnection.query(
    "SELECT questionid FROM questions WHERE questionid = ?",
    [questionid]
  );

  if (questionRows.length === 0) {
    res.status(404);
    throw new Error("Question not found with the provided ID.");
  }

  try {
    const insertQuery = `INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)`;
    const [result] = await mysqlconnection.query(insertQuery, [
      userid,
      questionid,
      answer,
    ]);

    if (result.affectedRows === 1) {
      res.status(201).json({
        message: "Answer submitted successfully",
        answer: {
          answer_id: result.insertId,
          userid,
          questionid,
          answer,
        },
      });
    } else {
      res.status(500);
      throw new Error("Failed to save the answer in the database.");
    }
  } catch (error) {
    console.error("Database error while posting answer:", error);
    res.status(500);
    throw new Error("Server error while saving answer.");
  }
});

// Get Answer

const getanswer = async (req, res) => {
  const questionid = req.query.questionid || "default_value";
  //   console.log(req.query)

  try {
    const readAnswers = `SELECT answers.*,users.username FROM answers LEFT JOIN users ON answers.userid = users.userid where answers.questionid=?`;
    const [answers] = await mysqlconnection.query(readAnswers, [questionid]);

    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
    }

    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Error fetching answers:", error.stack);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
};

module.exports = { postAnswer, getanswer };
