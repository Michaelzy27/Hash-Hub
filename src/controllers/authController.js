const jwt = require('jsonwebtoken');
const pool = require('./../db');

exports.signup = async (req, res) => {
    res.send("Signup route is working");
} 

exports.login = async (req, res) => {
    res.send("login route is working");
}

exports.forgotPassword = async (req, res) => {
    res.send("Forgot password route is working");
}