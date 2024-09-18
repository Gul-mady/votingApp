const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const os = require('os');
require('dotenv').config();
require('./database/connection');

const numCPUs = os.cpus().length;

const app = express();

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://voting-app-vite-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.send("Welcome to Voting App");
});

// Import routes
const userRoute = require('./routes/userRoute');
const candidateRoute = require('./routes/candidateRoute');
app.use('/user', userRoute);
app.use('/candidate', candidateRoute);

// Start server in cluster mode
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${PORT}`);
  });
}
