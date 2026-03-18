const jwt = require('./../utils/jwt');
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

        const token = jwt.generateToken(userId)

        console.log("JWT Token: ", token);

        res.status(200).json({
            ststus: 'success',
            message: "Signup successful",
            token
        })

    } catch (error) {

        console.log("Error: ", error);
        
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })

    }

} 

exports.completeProfile = async (req, res) => {
    try {

        const { firstName, lastName, username, location, skills, twitterUsername, referralCode } = req.body;
        console.log("Req body: ", req.body);
        
        const userId = req.user.id

        // Convert image buffer to base64 string for storing in DB
        let profilePicture = null;
        if (req.file) {
        const base64 = req.file.buffer.toString("base64");
        profilePicture = `data:${req.file.mimetype};base64,${base64}`;
        }

        const result = await pool.query(`UPDATE users SET first_name = $1, last_name = $2, 
            username = $3, profile_picture = $3, location = $4, twitter_handle = $5, 
            referral_code = $6, is_complete = $7 WHERE id =  $8 RETURNING *`, 
        [firstName, lastName, username, profilePicture, location, twitterUsername, referralCode ?? null, skills, true, userId])

        if(result.rows === 0) {
            res.status(400).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User profile updated successfully',
            data: {
                user: result.rows[0]
            }
        })
        
    } catch (error) {
        
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

        const token = jwt.generateToken(userId);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token
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