const express = require("express");
const router = express.Router();
const  elasticClient  = require("../../middleware/elasticsearch-client");

// Get all nodes
router.get("/", async (req, res) => {
    try {
      const  body  = await elasticClient.search({
        index: req.query.indexname, // Replace with your Elasticsearch index name
        size: 0,
        body: {
          aggs: {
            sensors: {
              terms: {
                field: "sensorid", // Assuming 'sensor_id' is a keyword field
                size: 10000, // Adjust as needed
              },
              aggs: {
                latest_timestamp: {
                  max: { field: "timestamp" }, // Aggregating the max timestamp
                },
                latest_data: {
                  top_hits: {
                    size: 1, // Retrieve only the latest document for each sensor
                    _source: ["timestamp", "sensorid", "flowrate", "totalflow", "pressure", "pressurevoltage", "location", "versioninfo"], // Specify the fields you want to retrieve
                    sort: [
                      {
                        timestamp: { order: "desc" }, // Sort by timestamp in descending order
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      });

      //console.log(body);
      // Extract the results
      const  buckets = body.aggregations.sensors.buckets;
      const latestData = buckets.map((bucket) => ({
        sensor_id: bucket.key,
        latest_timestamp: bucket.latest_timestamp.value_as_string,
        latest_data: bucket.latest_data.hits.hits[0]._source,
        //latest_coordinates: bucket.latest_data.hits.hits[0]._source.Coordinates,
      }));

      //console.log(latestData);
      res.json(latestData);
  
      // Send the latest data as the response
      
    } catch (error) {
      console.error("Error retrieving latest data:", error);
      res.status(500).json({ message: "Error retrieving latest data" });
    }
    
  });

module.exports = router;