const jwt = require('jsonwebtoken');
const pool = require('./../db');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {

    try {

        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).send("Please enter email and password")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`, [email, hashedPassword]);
        console.log("Signup result: ", result.rows);

        const userId = result.rows[0].id;

        const token = jwt.sign( { userId }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

        console.log("JWT Token: ", token);

        res.status(200).json({
            ststus: 'success',
            message: "Signup successful",
            data: {
                token
            }
        })

    } catch (error) {

        console.log("Error: ", error);
        
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })

    }

} 

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).send("Please enter email and password")
        }

        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        const user = result.rows[0]

        try {

            if(result.rows.length === 0 || !await bcrypt.compare(password, user.password_hash)){
                return res.status(401).json({
                    status: 'fail',
                    message: 'Incorrect email or password'
                })
            };

        } catch (error) {
            console.log("password check error: ", error);
            return res.status(500).send("Internal server error")
        }

        const userId = user.id;

        const token = jwt.sign( { userId }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                token
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })
    }
}

exports.forgotPassword = async (req, res) => {
    res.send("Forgot password route is working");
}