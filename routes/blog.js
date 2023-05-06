const express = require("express");
const Blog = require("../schemas/blog.js");
const Comment = require("../schemas/blog.js");
const loginAuth = require("../middlewares/loginChecker.js")
const router = express.Router();

// 게시글 조회
router.get('/post', async(req, res) => {
    const contents = await Blog.find({}).sort({ createdAt: 'desc' }).exec();
    const data = contents.map(c => {
        return {
            id: c._id,
            title: c.title,
            nickname: c.user,
            createdAt: c.createdAt
        }
    });

    res.status(200).json({ data: data })
})

// 게시글 상세 조회
router.get('/posts/:_postId', async(req, res) => {
    const { _postId } = req.params;
    const detailData = await Blog.findOne({ _id: _postId }).exec();
    if (detailData) {
        const result = {
            title: detailData.title,
            nickname: detailData.user,
            createdAt: detailData.createdAt,
            content: detailData.content
        }
        return res.status(200).json({ data: result });
    }
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

})

// 게시글 작성
router.post('/post', loginAuth, async(req, res) => {
    try {
        const user = res.locals.user.nickname;
        const { title, content } = req.body;
        const createdAt = new Date();

        await Blog.create({ user, title, content, createdAt });
        res.status(200).json({ message: "게시글을 생성하였습니다." });

    } catch (error) {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})

// 게시글 수정
router.put('/posts/:_postId', loginAuth, async(req, res) => {
    const { _postId } = req.params;
    const detailData = await Blog.findOne({ _id: _postId });

    if (detailData.length === 0) {
        return res.status(400).json({ message: "게시글 조회에 실패하였습니다." })
    }

    try {
        const user = res.locals.user.nickname;
        const { newTitle, newContent } = req.body;

        if (user !== detailData.user) {
            return res.status(403).send({
                errorMessage: "게시글 수정의 권한이 존재하지 않습니다."
            })
        }

        await Blog.updateOne({ _id: _postId }, { $set: { title: newTitle, content: newContent } });
        res.status(200).json({ message: "게시글을 수정하였습니다." });

    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
})

// 게시글 삭제
router.delete('/posts/:_postId', loginAuth, async(req, res) => {
    const { _postId } = req.params;
    const detailData = await Blog.findOne({ _id: _postId });

    if (detailData.length === 0) {
        return res.status(400).json({ message: "게시글 조회에 실패했습니다." })

    }
    try {
        const user = res.locals.user.nickname;
        if (user !== detailData.user) {
            return res.status(403).send({
                errorMessage: "게시글 삭제 권한이 없습니다."
            })
        }

        await Blog.deleteOne({ _id: _postId });
        await Comment.delete({ postid: _postId });
        res.status(200).json({ message: "게시글을 삭제했습니다." });

    } catch (error) {

        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
})

module.exports = router;