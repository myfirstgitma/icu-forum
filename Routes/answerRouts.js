const express = require('express');
const router = express.Router();
const { postAnswer,getanswer } = require('../Controller/answerController');

router.get("/getanswer",getanswer)
router.route('/').post( postAnswer); 


module.exports = router;