const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    text: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    author: {
        type: String,
        required: true
    },
}) 