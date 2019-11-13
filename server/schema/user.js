const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    status: {
        type: String,
        default: "Hello there",
        unique: false
    },
    following: {
        type: [{type: mongoose.Schema.Types.String, unique: true, dropDups: true}],
        default: [],
        unique: false
    },
    followers: {
        type: [{type: mongoose.Schema.Types.String, unique: true, dropDups: true}],
        default: [],
        unique: false
    }
}) 