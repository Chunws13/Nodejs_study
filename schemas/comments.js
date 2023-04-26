const mongooes = require("mongoose");

const commentSchema = new mongooes.Schema({
    postid: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

module.exports = mongooes.model("Comment", commentSchema);