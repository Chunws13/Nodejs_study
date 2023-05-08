const express = require("express");
const { Users } = require("../models");

const router = express.Router();
// const User = require("../schemas/user.js") db 변경으로 미사용

const nicknameChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{3,}$/;
const passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

router.post('/register', async(req, res) => {
    try {
        const { nickname, password, confirm } = req.body;
        const userCheck = await Users.findOne({
            where: {
                nickname: nickname
            }
        });

        if (userCheck) {
            return res.status(412).send({
                errorMessage: "중복된 닉네임입니다."
            })
        }

        if (password !== confirm) {
            return res.status(412).send({
                errorMessage: "패스워드가 일치하지 않습니다."
            })
        }

        if (!nicknameChecker.test(nickname)) {
            return res.status(412).send({
                errorMessage: "닉네임 형식이 일치하지 않습니다."
            })
        }

        if (!passwordChecker.test(password)) {
            return res.status(412).send({
                errorMessage: "패스워드 형식이 일치하지 않습니다."
            })
        }

        if (password.includes(nickname)) {
            return res.status(412).send({
                errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
            });
        }

        await Users.create({ nickname, password })
        return res.status(201).send({
            message: "회원 가입에 성공하였습니다."
        })

    } catch (error) {
        return res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        })
    }

})

module.exports = router;