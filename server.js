const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
require('./database/connection');

// Define CORS options
const corsOptions = {
  origin: ['https://voting-app-vite-frontend-afw2.vercel.app', 'http://localhost:5173'], // Allow requests from these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods including OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Specify allowed headers
  credentials: true // Allow credentials such as cookies and HTTP authentication
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // Preflight requests for all routes

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Welcome to Voting App");
});

const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

const candidateRoute = require('./routes/candidateRoute');
app.use('/candidate', candidateRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Your server is running on port# ${PORT}`);
});
