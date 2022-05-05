const express = require('express');
const controller = require('../controllers/index-controller');

const router = express.Router();

router.get('/', controller.getMessages);
router.get('/new', controller.createMessageGet);
router.post('/new', controller.createMessagePost);
router.post('/delete', controller.deleteMessage);

module.exports = router;
