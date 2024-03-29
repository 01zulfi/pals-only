const express = require('express');
const controller = require('../controllers/users-controller');

const router = express.Router();

router.get('/signup', controller.signupGet);
router.post('/signup', controller.signupPost);
router.get('/login', controller.loginGet);
router.post('/login', controller.loginPost);
router.get('/logout', controller.logout);
router.get('/member', controller.memberGet);
router.post('/member', controller.memberPost);
router.get('/admin', controller.adminGet);
router.post('/admin', controller.adminPost);
router.get('/:id', controller.userDetail);

module.exports = router;
