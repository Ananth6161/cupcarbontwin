var express = require("express");
var router = express.Router();
require('dotenv').config();
const  elasticClient  = require("../middleware/elasticsearch-client");
const User = require('../models/user');

router.get('/userinfo', (req, res) => {
  //console.log(req);
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

router.post('/userinfo', async (req, res) => {
  console.log(req.body);
  const indexName = req.body.filename; // You'll need to send this in the request body
  //console.log(indexName);
  //const simulationIndexName = `simulation${indexName}`;
  const userEmail = req.body.email;
  //console.log(userEmail);
  const index_mapping = {
    "mappings": {
            "properties": {
                "sensorid": {
                    "type": "keyword"
                },
                "flowrate": {
                    "type": "double"
                },
                "totalflow": {
                    "type": "double"
                },
                "pressure": {
                    "type": "double"
                },
                "pressurevoltage": {
                    "type": "double"
                },
                "timestamp": {
                    "type": "date"
                },
                "location": {
                    "type": "geo_point"
                },
                "versioninfo": {
                    "type": "text"
                }
            }
        }
    }

  try {
    const user = await User.findOne({ email: userEmail });

    if (user) {
      // Check if the index exists in Elasticsearch
      const indexExists = await elasticClient.indices.exists({ index: indexName });

      if (indexExists) {
        return res.status(400).json({ message: 'File already exists. Please choose another name.' });
      }

      // Push the new indexName into the user's indexes array
      user.indexes.push(indexName);

      // Save the updated user
      await user.save();

      // Now, you have created the index in Elasticsearch. You can update your database or any other required actions here.
      // For example, updating the User model's indexes array.
      await elasticClient.indices.create({ index: indexName, body: index_mapping });
      //await elasticClient.indices.create({ index: simulationIndexName, body: index_mapping });

      return res.status(200).json({ message: 'File created and user updated successfully.' });
    } else {
      return res.status(400).json({ message: 'User not found.' });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.get('http://localhost:4000/simulation/loading', (req, res) => {
  
})

router.post('/updateSensorData', async (req, res) => {
  // Get the index name and sensor data from the request
  try {
  const { indexname, sensorData, timestamp } = req.body;
  console.log('Received sensor data:', sensorData);
  console.log('Received index name:', indexname);
  const timestampDate = new Date(timestamp);
  console.log('Received timestamp as Date:', timestampDate);
  const formattedSensorData = sensorData.map(sensor => ({
    sensorid: sensor.id,
    flowrate: sensor.flowrate,
    totalflow: sensor.totalflow,
    pressure: sensor.pressure,
    pressurevoltage: sensor.pressurevoltage,
    timestamp: timestampDate,
    location: `${sensor.position[0]},${sensor.position[1]}`,
    versioninfo: 'Some version info',
  }));
  
  await elasticClient.bulk({
    body: formattedSensorData.flatMap(doc => [
      { index: { _index: indexname} },
      doc,
    ]),
  });
  res.status(200).send('Sensor data uploaded to Elasticsearch successfully.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error uploading sensor data to Elasticsearch.');
  }
});

module.exports = router;
