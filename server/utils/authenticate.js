const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {


    jwt.verify(req.headers.authorization, process.env.host, function(err, decoded) {

        if(err) {
            res.status(403).redirect("/")
        }

        req.id = decoded.id
    
    });

    next()

};