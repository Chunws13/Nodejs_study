const mongooes = require("mongoose");

const userSchema = new mongooes.Schema({
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongooes.model("User", userSchema);