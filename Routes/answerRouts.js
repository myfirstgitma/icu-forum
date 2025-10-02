const express = require('express');
const router = express.Router();
const { postAnswer } = require('../Controller/answerController');
 
router.route('/').post( postAnswer); 


module.exports = router;