var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');

const User = require("../models/user");
router.post("/", async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
    })
    console.log("IN REGISTER BACKEND");
    const data = await User.findOne({email: user.email});
    console.log(data);
        if(data){
            console.log(data);
            res.send({message:"user already exist"})
        }else {
            User.create(user)
            .then(adm => {
                res.status(200).send(adm)
            })
            .catch(err => {
                res.status(400).send("ERR")
            })
        }
    })


module.exports = router;