const db = require("../db/dbconfig");

const getAllQuestions = async (req, res) => {
  const sqlQuery = `
   
      SELECT 
            q.id AS question_id, 
            q.title, 
            q.description, 
            q.tag,
            q.created_at,               
            u.username 
        FROM 
            questions q
        JOIN 
            users u ON q.userid = u.userid
        ORDER BY 
            q.created_at DESC;
    
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

module.exports = { getAllQuestions};
