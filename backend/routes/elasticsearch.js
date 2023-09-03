const express = require("express");
require("dotenv").config();

const router = express.Router();
const { Client } = require("@elastic/elasticsearch"); // Elasticsearch client library

// Create an Elasticsearch client
const elasticClient = new Client({ 
    node: process.env.ELASTICSEARCH_URL,
    auth:{
        username: process.env.USERNAME, // Replace with your Elasticsearch username
        password: process.env.PASSWORD, // Replace with your Elasticsearch password
    }, }); // Adjust the Elasticsearch server URL as needed

module.exports = router;