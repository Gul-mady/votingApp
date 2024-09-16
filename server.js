const cluster = require('cluster');
const http = require('http');
const os = require('os');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./database/connection');

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://voting-app-vite-frontend-afw2.vercel.app'], // Allow requests from these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Specify allowed headers
  credentials: true // Allow credentials such as cookies and HTTP authentication
};

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  // Apply CORS middleware
  app.use(cors(corsOptions));

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
  http.createServer(app).listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port# ${PORT}`);
  });
}
