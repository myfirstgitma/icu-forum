const mysqlconnection = require("../db/dbconfig"); 
const asyncHandler = require("express-async-handler"); 

const postAnswer = asyncHandler(async (req, res) => {
  const { userid ,questionid, answer } = req.body;

  // Error Handling for missing answers ---
  if (!answer || !questionid) {
    res.status(400);
    throw new Error('Question ID and answer text are required.');
  }

  // Check if the question exists
  const [questionRows] = await mysqlconnection.query(
    'SELECT questionid FROM questions WHERE questionid = ?' ,[questionid]
  );
  
  if (questionRows.length === 0) {
    res.status(404);
    throw new Error('Question not found with the provided ID.');
  }

  try {
    // SQL query to insert the new answer
    const insertQuery = `INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)`;
    
    const [result] = await mysqlconnection.query(insertQuery, [userid, questionid, answer]);

    //  Response Handling (201 Created) ---
    if (result.affectedRows === 1) {
      res.status(201).json({
        message: 'Answer submitted successfully',
        answer: {
          answerid: result.insertId,
          userid: userid,
          questionid: questionid,
          answer: answer,
        },
      });
    } else {
      res.status(500);
      throw new Error('Failed to save the answer in the database.');
    }
  } catch (error) {
    // If a foreign key constraint fails (though covered by the check above)  or another DB error occurs.
    console.error("Database error while posting answer:", error);
    res.status(500);
    throw new Error('Server error while saving answer.');
  }
});

module.exports = {postAnswer,};