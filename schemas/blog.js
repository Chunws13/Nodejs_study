const mongooes = require("mongoose");

const blogSchema = new mongooes.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
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

module.exports = mongooes.model("Blog", blogSchema);