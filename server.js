const express = require('express');
const app = express();
require('dotenv').config();
require('./database/connection');


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json())
// const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("welcome to voting app")
})


const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)

const candidateRoute = require('./routes/candidateRoute');
app.use('/candidate', candidateRoute)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Your server is running on port# 4000")
})
