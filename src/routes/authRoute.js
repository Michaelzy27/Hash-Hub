const express = require('express');
const authController = require('./../controllers/authController');
const authenticate = require('./../middlewares/authenticate')
const upload = require('./../middlewares/upload')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/complete-profile', authenticate, upload.single("avatar"), authController.completeProfile)
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;