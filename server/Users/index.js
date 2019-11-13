const createHandler = require("azure-function-express").createHandler
const express = require("express")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const database = require("../utils/db")
const auth = require("../utils/authenticate")
const parser = require("../utils/bodyParser")

const app = express();

// Search user that begins with username or status
app.get("/api/users", parser, auth, async (req, res) => {

    const { User } = await database();

    const regUsername = new RegExp("^"+ req.query.username);
    const regStatus = new RegExp("^"+ req.query.status);

    User.find({ $or:[ {"username": regUsername}, {"status": regStatus} ]})
        .then(users => res.json(users))
        .catch(err => res.status(404).json(err))

});

// Create new user
app.post("/api/users", parser, async (req, res) => {

    const { User } = await database();

    const errors = {}
  
    if(!validator.isLength(req.body.username, {min: 6, max: 30})) errors.username = "Username should be 6-30 characters long"

    if(!validator.isLength(req.body.password, {min: 6, max: 30})) errors.password = errors.repassword = "Password should be 6-30 characters long"
    
    if(Object.entries(errors).length !== 0) res.status(404).json({errors})

    User.findOne({username: req.body.username})
        .then(user => {

            if(user) res.status(404).json({errors: {username: "User already exists"}})

            bcrypt.hash(req.body.password, 10, function(err, hash) {
            
                if(err) res.status(404).json({errors: err})
        
                req.body.password = hash
        
                const userData = new User({ ...req.body });
                
                userData.save().then(user => res.json(user));
        
            });  

    }).catch(err => res.status(404).json(err))

});

// Update user
app.put("/api/users", parser, auth, async (req, res) => {

    const { User } = await database()

    User.update({_id: req.id}, { status: req.body.status })
        .then(response => res.json(response))
        .catch(err => res.status(404).json(err))

});

// Delete user
app.delete("/api/users", auth, async (req, res) => {

    const { User, Post } = await database()

    User.findById(req.id)
        .then(user => {

            if(!user) res.status(404).json({error: "User not found"})

            Post.deleteMany({author: user._id})
                .then(response => res.json({message: "User successfully deleted"})
                .catch(err => res.status(500).json(err))

        )}).catch(err => res.status(404).json(err))

});

module.exports = createHandler(app);