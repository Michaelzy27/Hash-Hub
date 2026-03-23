const express = require('express');
const sponsorsController = require('./../controllers/sponsorsController');
const authenticate = require('./../middlewares/authenticate')
const upload = require('./../middlewares/upload')

const router = express.Router()

router.route('/')
    .get(authenticate, sponsorsController.getSponsorData)

router.route('/create')
    .post(authenticate, upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'companyLogo', maxCount: 1 }
    ]), sponsorsController.createSponsor)

module.exports = router