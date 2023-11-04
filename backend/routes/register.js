var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');
var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
function isEmailValid(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}
const User = require("../models/user");
router.post("/", async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
        indexes:[],
    })
    console.log("IN REGISTER BACKEND");
    if(isEmailValid(user.email)){
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
    }
    else{
       res.send({message:"Not a Valid Email"}) 
       console.log(user.email);
       console.log("not validated");
    }
    })



module.exports = router;