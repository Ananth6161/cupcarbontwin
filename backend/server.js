const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

var loginRoute = require("./routes/login");
var registerRoute = require("./routes/register");
const { elasticClient } = require("./routes/elasticsearch");

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

db.on('error', (error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

// setup API endpoints
app.use("/login", loginRoute);
app.use("/register", registerRoute);

app.listen(process.env.PORT, function() {
    console.log("Server is running on Port: " + process.env.PORT);
});
