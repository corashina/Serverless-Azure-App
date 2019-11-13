const queryString = require("query-string")

module.exports = function(req, res, next) {

    // Postman
    if(typeof req.body === "string") req.body = queryString.parse(req.body)

    next()

};