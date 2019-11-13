const createHandler = require("azure-function-express").createHandler
const express = require("express")
const validator = require("validator")

const database = require("../utils/db")
const parser = require("../utils/bodyParser")
const auth = require("../utils/authenticate")

const app = express();

// Return all posts by user
app.get("/api/posts", auth, async (req, res) => {

    const { Post } = await database()

    User.findOne({_id: req.id})
        .then(user => {

            Post.find({author: user.username})
                .then(posts => res.json(posts))
                .catch(err => res.status(404).json(err))  

        })   .catch(err => res.status(404).json(err))  

});

// Create new post by user
app.post("/api/posts", parser, auth, async (req, res) => {

    const { User, Post } = await database()

    const errors = {}

    if(!validator.isLength(req.body.text, {min: 4, max: 250})) errors.text = "Text should be between 1 and 250 characters long"

    if(Object.entries(errors).length !== 0) res.status(404).json({errors})

    User.findById(req.id)
        .then(user => {
            
            if(!user) res.status(404).json({errors: { server: "User does not exist"}})

            const post = new Post({ 
                text: req.body.text,
                author: user.username
            })

            post.save().then(post => 
                User.update({_id: user._id}, {$push: {posts: post._id}})
                    .then(response => res.json(post))
                    .catch(err => res.status(500).json(err)))

        })
        .catch(err => res.status(500).json(err))



});

// Delete all posts created by user
app.delete("/api/posts", parser, auth, async (req, res) => {

    const { User, Post } = await database()

    User.findByIdAndUpdate(req.id, {posts: []})
        .catch(err => res.status(500).json(err))

    Post.deleteMany({author: req.id})
        .then(response => res.json({message: "Successfully deleted all user posts", response}))
        .catch(err => res.status(500).json(err))

});

module.exports = createHandler(app);