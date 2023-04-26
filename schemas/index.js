const mongooes = require("mongoose");

const connect = () => {
    mongooes
        .connect("mongodb://localhost:27017/spa_blog")
        .catch(err => console.log(err));
}

mongooes.connection.on("error", err => {
    console.log("DB 연결 에러", err);
})

// 이 이름으로 export 한다.
module.exports = connect;