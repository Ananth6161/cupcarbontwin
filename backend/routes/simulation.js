var express = require("express");
var router = express.Router();
require('dotenv').config();
const  elasticClient  = require("../middleware/elasticsearch-client");
const User = require('../models/user');

router.get('/userinfo', (req, res) => {
  
  const userEmail = req.query.email;
  console.log(userEmail);
  User.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Respond with the user's data
      res.status(200).json(user);
      console.log(user);
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/userinfo', (req, res) => {
  // Get the index name from the request
  const indexName = req.query.filename; // You'll need to send this in the request body
  const simulationIndexName = `simulation${indexName}`;
  const userEmail = req.query.email;
  // Check if the index exists
  elasticClient.indices.exists({ index: indexName })
    .then((indexExists) => {
      if (indexExists) {
        return res.status(400).json({ message: 'File already exists. Please choose another name.' });
      } else {
        // If the index does not exist, create it
        return elasticClient.indices.create({ index: indexName })
          .then(() => {
            // Now, you have created the index in Elasticsearch. You can update your database or any other required actions here.
            // For example, updating the User model's indexes array.
            return User.findOneAndUpdate({ email: userEmail }, { $push: { indexes: indexName } })
              .then(() => {
                return elasticClient.indices.create({ index: simulationIndexName })
                  .then(() => {
                    // Handle success for creating the simulation index
                    return res.status(200).json({ message: 'File created and user updated successfully.' });
                  })
              })
              .catch((err) => {
                console.error('Error:', err);
                res.status(500).json({ message: 'Internal server error' });
              });
          })
          .catch((err) => {
            console.error('Error:', err);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('http://localhost:4000/simulation/loading', (req, res) => {
  
})

router.post('http://localhost:4000/simulation/updateSensorData', (req, res) => {
  // Get the index name and sensor data from the request
  const indexName = req.query.indexname;
  const sensorData = req.query.sensorData;
  const sensors = JSON.parse(sensorData);
  elasticClient.index({
    index: indexName, // Specify the index name
    body: sensors, // The sensor data you want to upload
  })
  .then((response) => {
    console.log(`Successfully indexed data with ID: ${response.body._id}`);
    res.status(200).send('Data successfully indexed');
  })
  .catch((error) => {
    console.error('Error indexing data:', error);
    res.status(500).send('Internal server error');
  });
});

module.exports = router;
