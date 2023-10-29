const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb'); // Import MongoDB module
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Import JWT module
// Add your /latestdata route

app.get('/', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Establish a connection to MongoDB Atlas
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect((err) => {
      if (err) {
        return res.status(500).send('Database connection error');
      }

      const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);

      // Find the user by email and return their data
      collection.findOne({ email: decoded.email }, (err, user) => {
        if (err) {
          return res.status(500).send('Error retrieving user data');
        }

        if (user) {
          res.json(user);
        } else {
          res.status(404).send('User not found');
        }

        client.close(); // Close the MongoDB connection
      });
    });
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

