const express = require("express");
const router = express.Router();
const { elasticClient } = require("../elasticsearch");

// Get all nodes
router.get("/latestData", async (req, res) => {
    try {
      const { body } = await client.search({
        index: nodes,
        size: 0,
        body: {
          aggs: {
            sensors: {
              terms: {
                field: "sensor_id.keyword", // Assuming 'sensor_id' is a keyword field
                size: 10000, // Adjust as needed
              },
              aggs: {
                latest_timestamp: {
                  max: { field: "timestamp" }, // Aggregating the max timestamp
                },
                latest_data: {
                  top_hits: {
                    size: 1, // Retrieve only the latest document for each sensor
                    _source: ["timestamp", "sensor_id", "data"], // Specify the fields you want to retrieve
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
  
      // Extract the results
      const buckets = body.aggregations.sensors.buckets;
      const latestData = buckets.map((bucket) => ({
        sensor_id: bucket.key,
        latest_timestamp: bucket.latest_timestamp.value_as_string,
        latest_data: bucket.latest_data.hits.hits[0]._source,
      }));
  
      // Send the latest data as the response
      res.json(latestData);
    } catch (error) {
      console.error("Error retrieving latest data:", error);
      res.status(500).json({ message: "Error retrieving latest data" });
    }
  });