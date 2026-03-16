const express = require('express');
const authRoute = require('./routes/authRoute');
const cors = require('cors');

const app = express();

app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://thesilverkey.lovable.app',
    'http://localhost:8080'
]

app.use(cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

app.use('/auth', authRoute);

app.all('*path', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot find path ${req.originalUrl} in this server`
    });
})

app.listen(4000, () => console.log("Server running on Port 4000"));