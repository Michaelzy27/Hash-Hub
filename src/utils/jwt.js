const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET_KEY;

exports.generateToken = (userId) => {    
    
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' })

    return token;

}

exports.verifyToken = token => {
    return jwt.verify(token, jwtSecret)
}