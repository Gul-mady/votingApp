const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL  //for local connection

// Fetch MongoDB URL from environment variables
// const mongoURL = process.env.MONGODB_URL; // Ensure this environment variable is set

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Export the connection
const connection = mongoose.connection;
module.exports = connection;
