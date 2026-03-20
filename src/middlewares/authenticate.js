const jwt = require('./../utils/jwt');
const pool = require('./../db');

const authenticate = async (req, res, next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log("Token: ", token);
    
 
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Auth token required!'
        })
    }

    //verification of token
    const decoded = jwt.verifyToken(token)
    console.log(decoded);

    //check if user still exists in db (in case user is deleted after token is issued)
    const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [decoded.userId])

    if(userResult.rows.length === 0) {
        return res.status(401).json({
            status: 'fail',
            message: 'User no longer exists'
        })
    }

    //check if user changed password
    //TODO!

    //TODO: add user info to req object and use it in the controllers
    //TODO: add token expiration handling

    req.user = userResult.rows[0];

    next();

}

module.exports = authenticate;