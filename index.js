const express = require("express");
const connect = require("./schemas");
const cookieParser = require("cookie-parser");

const blogRouter = require("./routes/blog.js");
const commentsRouter = require("./routes/comments.js");
const registerRouter = require("./routes/register.js");
const loginRouter = require("./routes/login.js");


const app = express();
const port = 3000;

const { default: mongoose } = require("mongoose");
connect();

app.use(cookieParser());
app.use(express.json());
app.use("/api", [blogRouter, commentsRouter, registerRouter, loginRouter]);

app.get('/', (req, res) => {
    res.send('This Website for nodejs study');
})


app.listen(port, () => {
    console.log(`Listening at ${port}`);
})