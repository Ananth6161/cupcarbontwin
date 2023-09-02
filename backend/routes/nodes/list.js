const express = require('express');
const app = express();
const esClient = require('./elastic');
app.get('/allnodes', async (req, res) => {
    try {
      const { body } = await esClient.search({
        index: 'nodes', // Your Elasticsearch index name
        body: {
          query: {
            match_all: {},
          },
        },
      });
  
      const nodes = body.hits.hits.map((hit) => ({
        id: hit.node_id,
        network_type: hit.network_type,
        sensor_type: hit.sensor_type,
        latitude: hit.latitude,
        longitude: hit.longitude,
        // Add other node properties here
      }));
  
      res.json(nodes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
app.post('/addnode', async (req, res) => {
    try {
      const { nodeData } = req.body; 
      const response = await esClient.index({
        index: 'nodes', // Your Elasticsearch index name
        body: nodeData,
      });
      
      // Respond with the newly created node's ID or other relevant information
      res.json({ message: 'Node added successfully', nodeId: response.body._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  