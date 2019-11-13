const createHandler = require("azure-function-express").createHandler
const express = require("express")

const database = require("../utils/db")
const parser = require("../utils/bodyParser")
const auth = require("../utils/authenticate")

const app = express();

// Get user
app.get("/api/users/:username", parser, auth, async (req, res) => {

    const { User } = await database()
    
    User.findOne({username: req.params.username})
        .then(user => res.json(user))
        .catch(err => res.status(404).json(err))

});

module.exports = createHandler(app);