const express = require('express');
const controller = require('../controllers/users-controller');

const router = express.Router();

router.get('/signup', controller.signupGet);
router.post('/signup', controller.signupPost);
router.get('/login', controller.loginGet);
router.post('/login', controller.loginPost);
router.get('/logout', controller.logout);
router.get('/:id', controller.userDetail);

module.exports = router;
