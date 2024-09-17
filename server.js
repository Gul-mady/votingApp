const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
require('./database/connection');


// Define CORS options
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       'https://voting-app-vite-frontend.vercel.app',
//       'http://localhost:3000',
//       'http://localhost:5173'
//     ];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS')); // Reject the request
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type,Authorization,x-access-token',
//   credentials: true // Allow credentials
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// // For preflight requests
// app.options('*', cors(corsOptions));

// const allowedOrigins = ['http://localhost:5173'];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://voting-app-vite-frontend.vercel.app'], // Allow requests from these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Specify allowed headers
  credentials: true // Allow credentials such as cookies and HTTP authentication
};

// Apply CORS middleware
app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
