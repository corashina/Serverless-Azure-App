
const createHandler = require("azure-function-express").createHandler
const express = require("express")

const database = require("../utils/db")
const parser = require("../utils/bodyParser")
const auth = require("../utils/authenticate")

const app = express();

app.get("/api/users/:username/posts", parser, auth, async (req, res) => {

    const { User, Post } = await database()
    
    User.findOne({username: req.params.username})
        .then(user => {

            Post.find({author: user.username})
                .then(posts => res.json(posts))
                .catch(err => res.status(404).json(err))

        })
        .catch(err => res.status(404).json(err))

});

module.exports = createHandler(app);