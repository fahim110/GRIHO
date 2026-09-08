const express = require('express');
const router = express.Router();
const {
  getRoommates,
  createRoommatePost,
} = require('../controllers/roommateController');

router.get('/', getRoommates);
router.post('/', createRoommatePost);

module.exports = router;
