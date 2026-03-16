const express = require('express');
const bountyController = require('./../controllers/bountryController');
const authenticate = require('./../middlewares/authenticate');

const router = express.Router();

router.route('/')
    .get(authenticate, bountyController.getBounties)
    .post(authenticate, bountyController.addBounty)

module.exports = router;