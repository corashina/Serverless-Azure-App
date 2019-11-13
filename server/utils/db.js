const mongoose = require('mongoose')
const UserSchema = require('../schema/user')
const PostSchema = require('../schema/post')

let connection, User, Post;

module.exports = async function() {

    const uri = `mongodb://${process.env.user}:${process.env.dbpassword}@${process.env.host}:${process.env.port}/${process.env.dbname}?ssl=true&replicaSet=globaldb`

    if (!connection) connection = await mongoose.connect(uri, {
        useCreateIndex: true,
        useUnifiedTopology: true, 
        useNewUrlParser: true
    });

    if (!User) User = mongoose.model('User', UserSchema, 'users');

    if (!Post) Post = mongoose.model('Post', PostSchema, 'posts');

    return {
        connection,
        User,
        Post
    }

};