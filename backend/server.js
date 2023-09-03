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

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + process.env.DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/login", loginRoute);
app.use("/register", registerRoute);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + process.env.PORT);
});
