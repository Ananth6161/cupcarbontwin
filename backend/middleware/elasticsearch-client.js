const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

// const fs = require('fs');
// const path = require('path'); // Import the path module

// console.log("ELASTICSEARCH_URL:", process.env.ELASTICSEARCH_URL);
// console.log("USERNAME:", process.env.USERNAME);
// console.log("PASSWORD:", process.env.PASSWORD);

// Get the absolute path to the certificate file using __dirname
// const certificatePath = path.join(__dirname, 'http_ca.crt');
// if (fs.existsSync(certificatePath)) {
//     const ca = fs.readFileSync(certificatePath);
//     const elasticClient = new Client({
//         node: process.env.ELASTICSEARCH_URL,
//         auth: {
//           username: process.env.USERNAME,
//           password: process.env.PASSWORD,
//         },
//         tls: {
//           ca: ca,
//           rejectUnauthorized: false
//         }
//       });
//     // Rest of your code here
//     console.log("Connected to Elasticsearch")
//     module.exports = elasticClient;
//   } else {
//     console.error(`Certificate file '${certificatePath}' does not exist.`);
//     process.exit(1); // Exit the process with an error code
//   }

// // Initialize the Elasticsearch client

// const initializeElasticsearchClient = async () => {
//   const elasticClient = new Client({
//     node: process.env.ELASTICCLOUD_URL,
//     auth: {
//       apiKey: process.env.ELASTICCLOUD_APIKEY
//     }
//   });

//   try {
//     const resp = await elasticClient.info();
//     console.log(resp);
//     return elasticClient;
//   } catch (error) {
//     console.error("Error initializing Elasticsearch client:", error);
//     throw error;
//   }
// };

// // const query = {
// //   index: 'sensordata', // Replace with your Elasticsearch index name
// //   body: {
// //     "query": {
// //       "match_all": {},
// //     },
// //   },
// // };


// //console.log(initializeElasticsearchClient().search(query));

// module.exports = initializeElasticsearchClient();

const elasticClient = new Client({
  cloud: {
    id: process.env.ELASTICCLOUD_ID,
  },
  auth : {
    username: process.env.ELASTICCLOUD_USERNAME,
    password: process.env.ELASTICCLOUD_PASSWORD,
  },
});

module.exports = elasticClient;
