const express = require('express')
const authenticate = require('./../middlewares/authenticate')
const profileController = require('./../controllers/profileController')

const router = express.Router()

router.route('/')
    .put(authenticate, profileController.updateProfile)