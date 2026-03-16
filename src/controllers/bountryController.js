const pool = require('./../db');

exports.getBounties = async (req, res) => {
    res.send("bounties gotten");
}

exports.addBounty = async (req, res) => {
    res.send("Bounty added")
}