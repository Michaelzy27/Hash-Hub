require('dotenv').config( { path: `${__dirname}/../.env` } );
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const bountyRoute = require('./routes/bountyRoute');


const app = express();

app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://hedera-hustle-hub.lovable.app',
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
}));

app.use('/auth', authRoute);
app.use('/bounty', bountyRoute);

app.all('*path', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot find path ${req.originalUrl} in this server`
    });
})

app.listen(4000, () => console.log("Server running on Port 4000"));