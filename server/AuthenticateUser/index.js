const createHandler = require("azure-function-express").createHandler
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const database = require("../utils/db")
const parser = require("../utils/bodyParser")
const auth = require("../utils/authenticate")

const app = express();

app.get("/api/users/auth", parser, auth, async (req, res) => {

    const { User, Post } = await database();
    
    User.findById(req.id)
        .then(user => {

            Post.find({author: {$in: [...user.following, user.username]}})
                .then(posts => res.json({user, posts}))
                .catch(err => res.status(404).json(err))
        
        })
        .catch(err => res.status(404).json(err))
            

});

// Compare password hashes in database to verify user, and assign json web token
app.post("/api/users/auth", parser, async (req, res) => {

    const { User } = await database();
    
    User.findOne({username: req.body.username})
        .then(user => {
            
            if(!user) res.status(404).json({errors: {username: "User not found"}})

            bcrypt.compare(req.body.password, user.password)
                  .then(match => {

                    if(!match) res.status(403).json({errors: {password: "Wrong password"}})

                    const token = jwt.sign({ id: user._id }, process.env.host);

                    res.json({
                        token
                    })

            })
 

    }).catch(err => res.status(500).json(err))

});

module.exports = createHandler(app);