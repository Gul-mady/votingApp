const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
require('./database/connection');

// Define CORS options
// const corsOptions = {
//   origin: 'http://localhost:3000', // Change this to your frontend URL
//   methods: 'GET,POST,PUT,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type,Authorization,x-access-token',
//   credentials: true, // If you want to allow cookies or authentication headers
// };

// app.use(cors(corsOptions)); // Apply CORS options

const allowedOrigins = ['http://localhost:3000', 'https://lustrous-custard-f854e0.netlify.app/'];
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.send("welcome to voting app");
});

const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

const candidateRoute = require('./routes/candidateRoute');
app.use('/candidate', candidateRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Your server is running on port# ${PORT}`);
});
