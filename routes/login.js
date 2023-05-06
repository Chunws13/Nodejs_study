const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");
const router = express.Router();

router.post('/login', async(req, res) => {
    try {
        const { nickname, password } = req.body;
        const userCheck = await User.findOne({ nickname });

        if (userCheck.length === 0 || userCheck.password !== password) {
            return res.status(412).send({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요"
            })
        }

        const token = jwt.sign({ nickname: userCheck.nickname }, "keys");
        res.cookie("authorization", `Bearer ${token}`)
        return res.status(200).json({ token });

    } catch (error) {
        return res.status(400).send({
            errorMessage: "로그인에 실패하였습니다."
        })
    }
})

module.exports = router;