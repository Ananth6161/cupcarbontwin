var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const verifyJWT = require("../middleware/verifyJWT");

// function getidByEmail(email) {
//     return new Promise((resolve, reject) => {
//         Admin.findOne({ email: email }, (err, admin) => {
//             if (err) {
//                 return
//             } else {
//                 resolve(admin._id);
//             }
//         });
//     });
// }

// router.post("/getToken", (req, res) => {
//     res.send({
//         token: 'test123'
//     });
// })

router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("You have successfully logged in back");
    if (email && password) {
            const user = await User.findOne({ email: email })
            // console.log(user.name);
            if (!user) {
                return res.status(401).json({
                    message: "No Account exists with the given credentials"
                })
            }
            console.log(password);
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Credentials"
                })
            }

            const payload = {
                id: user._id,
                email: user.email
            }
            const token = jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                    if (err) {
                        return res.json({
                            message: err
                        })
                    }
                    return res.status(200).json({
                        message: "Success",
                        token: "user " + token
                    })
                }
            )
    } else {
        res.json({
            success: false,
            msg: "Error: Email or password cannot be blank"
        });
    }
});

router.get("/isUserAuth", verifyJWT, (req, res) => {
    return res.json(
        {
            isLoggedIn: true,
            user: req.user
        });
})

module.exports = router;