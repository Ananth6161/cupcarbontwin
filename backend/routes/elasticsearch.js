const express = require("express");
require("dotenv").config();
const router = express.Router();
const  elasticClient  = require("../middleware/elasticsearch-client");

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: process.env.ELASTICCLOUD_URL,
    auth: {
      apiKey: process.env.ELASTICCLOUD_APIKEY
    }
})



//console.log("Connected to Elasticsearch: ", elasticClient);
    router.get("/sensorsamplefinals/_search", async (req, res) => {
      try {
        // Define your Elasticsearch query to fetch data
        // const query = {
        //   index: 'sensordata', // Replace with your Elasticsearch index name
        //   body: {
        //     "query": {
        //       "match_all": {},
        //     },
        //   },
        // };
    
        // Perform an Elasticsearch query using the defined query
        //const response = await client.search(query);
        const response = await elasticClient.search(req);
        console.log(response);
        
        res.json(response);
      } catch (error) {
        console.error("Elasticsearch Error:", error);
        res
          .status(500)
          .json({ error: "An error occurred while querying Elasticsearch." });
      }
    });
module.exports = router;