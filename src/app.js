const express = require('express');
const authRoute = require('./routes/authRoute');

const app = express();

app.use(express.json());

app.use('/auth', authRoute);

app.all('*path', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot find path ${req.originalUrl} in this server`
    });
})

app.listen(4000, () => console.log("Server running on Port 4000"));