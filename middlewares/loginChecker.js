const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");

module.exports = async(req, res, next) => {
    try {
        const { authorization } = req.cookies;

        if (!authorization) {
            return res.status(403).send({
                errorMessage: "로그인이 필요한 기능입니다."
            })
        }
        const [tokenType, tokenValue] = authorization.split(" ");

        // 인증 실패
        if (tokenType !== 'Bearer') {
            res.clearCookie('Authorization');

            return res.status(403).send({
                errorMessage: "전달된 쿠키에서 오류가 발생했습니다."
            })
        }

        const { nickname } = jwt.verify(tokenValue, "keys");
        const user = await User.findOne({ nickname });

        res.locals.user = user;
        next();

    } catch (error) {
        res.clearCookie('Authorization');
        return res.status(403).send({
            errorMessage: "로그인이 필요한 기능입니다."
        })
    }
}