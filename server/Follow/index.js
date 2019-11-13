const createHandler = require("azure-function-express").createHandler
const express = require("express")

const database = require("../utils/db")
const parser = require("../utils/bodyParser")
const auth = require("../utils/authenticate")

const app = express();

// Follow user
app.post("/api/users/:username/follow", parser, auth, async (req, res) => {

    const { User } = await database()

    User.findById(req.id)
        .then(user => {

            if(!user) res.status(404).json({errors: {server: "Authentication error"}})

            User.findOne({username: req.params.username})
                .then(userToFollow => {

                    if(!userToFollow) res.status(404).json({errors: {server: "User does not exist"}})

                    if(user.username == userToFollow.username) {
                        res.json({message: "You cant follow yourself"})
                        return
                    }

                    let isFollowing = user.following.includes(userToFollow.username)
                    let isFollowed = userToFollow.followers.includes(user.username)

                    if(!isFollowed && !isFollowing) {
                        
                        User.update({_id: user._id}, {$push: {following: userToFollow.username}})
                            .then(response => User.update({_id: userToFollow._id}, {$push: {followers: user.username}}))
                            .then(response => res.json({userToFollow, message: `Followed ${userToFollow.username} successfully`}))
                            .catch(err => res.status(403).json(err))

                    } else if(isFollowed && isFollowing) {
                    
                        User.update({_id: user._id}, {$pull: {following: userToFollow.username}})
                            .then(response => User.update({_id: userToFollow._id}, {$pull: {followers: user.username}}))
                            .then(response => res.json({userToFollow, message: `Unfollowed ${userToFollow.username} successfully`}))
                            .catch(err => res.status(403).json(err))

                    } else res.status(500).json({error: "Follow error"})

            })

    }).catch(err => res.status(500).json(err))

});

module.exports = createHandler(app);