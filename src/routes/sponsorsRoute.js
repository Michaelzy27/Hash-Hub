const express = require('express');
const sponsorsController = require('./../controllers/sponsorsController');

const router = express.Router()

router.route('/create')
    .post(sponsorsController.createSponsor)