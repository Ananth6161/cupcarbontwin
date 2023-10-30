var express = require("express");
var router = express.Router();
require('dotenv').config();
const User = require('../models/user');
const verifyJWT = require("../middleware/verifyJWT");

router.get('/', verifyJWT, (req, res) => {
  // Use the userId to retrieve the user's data from the database using promises
  User.findById(req.userId)
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



module.exports = router;
