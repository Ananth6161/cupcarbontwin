const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
// const ROLES = {
//     ADMIN: "ADMIN",
//     SUPERVISOR: "SUPERVISOR",
//     USER: "USER"
//   };

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    indexes: {
        type: [String]
    },
    // role: {
    //     type: String,
    //     enum: Object.values(ROLES),
    //     default: ROLES.USER
    // }
});

module.exports = User = mongoose.model('Admin', UserSchema);