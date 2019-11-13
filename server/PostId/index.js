const createHandler = require("azure-function-express").createHandler
const express = require("express")

const database = require("../utils/db")
const parser = require("../utils/bodyParser")
const auth = require("../utils/authenticate")

const app = express();

// Get post
app.get("/api/posts/:id", parser, auth, async (req, res) => {

    const { Post } = await database()

    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(500).json(err))

});

// Update post
app.put("/api/posts/:id", parser, auth, async (req, res) => {

    const { Post } = await database()

    Post.findById(req.params.id)
        .then(post => {

            if(!post) res.status(404).json({error: "Post does not exist"})

            const owner = post.author == req.id

            if(!owner) res.status(404).json({error: "User authentication failed"})

            post.text = req.body.text

            post.save().then(post => res.json({message: "Post successfully updated", post}))

    }).catch(err => res.status(500).json(err))

});

// Delete post
app.delete("/api/posts/:id", auth, async (req, res) => {

    const { Post } = await database()

    Post.findById(req.params.id)
        .then(post => {

            if(!post) res.status(404).json({error: "Post does not exist"})

            post.remove().then(post => res.json({message: "Post successfully deleted", post}))

    }).catch(err => res.status(500).json(err))

});

module.exports = createHandler(app);