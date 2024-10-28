const express = require('express');
const router = express.Router();
const CombinationController = require('../controllers/CombinationController')

router.post('/generate', CombinationController.getCombinations);

module.exports = router;
