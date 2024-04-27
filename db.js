const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017";

async function connectToMongo() {
    try {
      // Use await to connect to MongoDB
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Other mongoose options if needed
      });
  
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  }

module.exports = connectToMongo;