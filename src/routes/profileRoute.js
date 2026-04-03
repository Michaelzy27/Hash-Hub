const express = require('express')
const authenticate = require('./../middlewares/authenticate')
const profileController = require('./../controllers/profileController')

const router = express.Router()

router.route('/')
    .get(authenticate, profileController.getProfile)
    .put(authenticate, profileController.updateProfile)

module.exports = router