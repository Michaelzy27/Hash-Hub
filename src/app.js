const express = require('express');
const authRoute = require('./routes/authRoute');

const app = express();

app.use(express.json);

app.use('/auth', authRoute)

app.listen(3000, () => console.log("Server running on Port 3000"));