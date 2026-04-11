const express = require('express');
const bountyController = require('./../controllers/bountryController');
const authenticate = require('./../middlewares/authenticate');

const router = express.Router();

router.route('/')
    .get(bountyController.getBounties)
    .post(authenticate, bountyController.addBounty)

router.post('/submit', authenticate, bountyController.submitBounty)
router.post('/add', authenticate, bountyController.addBountySponsor)

module.exports = router;