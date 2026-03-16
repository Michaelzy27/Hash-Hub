const express = require('express');
const bountyController = require('./../controllers/bountryController');

const router = express.Router();

router.route('/')
    .get(bountyController.getBounties)
    .post(bountyController.addBounty)

module.exports = router;