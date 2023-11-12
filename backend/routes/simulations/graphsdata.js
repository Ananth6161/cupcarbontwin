const express = require("express");
const router = express.Router();
const  elasticClient  = require("../../middleware/elasticsearch-client");

// Get all nodes
router.post("/getlastn", async (req, res) => {
    const index = req.body.index;
    const node_id = req.body.node_id;
    const size = req.body.size;
    try {
      const  body  = await elasticClient.search({
        index: index, // Replace with your Elasticsearch index name
        size: 0,
        body: {
          aggs: {
            sensors: {
                query: {
                    term: {
                      node_id: node_id, // Filter by the specific node_id
                    },
                  },
              aggs: {
                latest_timestamp: {
                  max: { field: "timestamp" }, // Aggregating the max timestamp
                },
                latest_data: {
                  top_hits: {
                    size: size, // Retrieve only the latest document for each sensor
                    _source: ["timestamp", "node_id", "value1", "value2", "value3", "value4", "value5", "value6", "Coordinates", "version"], // Specify the fields you want to retrieve
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