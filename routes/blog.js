const express = require("express");
const { Users, Blogs, Comments } = require("../models")
const loginAuth = require("../middlewares/loginChecker.js")
const router = express.Router();
// const Blog = require("../schemas/blog.js");
// const Comment = require("../schemas/blog.js");

// 게시글 조회
router.get('/post', async(req, res) => {
    const contents = await Blogs.findAll({
        attributes: ['title', 'createdAt'],
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: Users,
            attributes: ['nickname']
        }]
    });

    return res.status(200).json({ data: contents })
})

// 게시글 상세 조회
router.get('/posts/:_postId', async(req, res) => {
    const { _postId } = req.params;
    const detailData = await Blogs.findOne({
        attributes: ['title', 'content', 'createdAt'],
        where: { postId: _postId },
        include: [{
            model: Users,
            attributes: ['nickname']
        }]
    });

    if (detailData) {
        return res.status(200).json({ data: detailData });
    }
    return res.status(400).json({ message: '페이지를 찾을 수 없습니다.' });
})

// 게시글 작성
router.post('/post', loginAuth, async(req, res) => {
    try {
        const { userId } = res.locals.user;
        const { title, content } = req.body;
        const createdAt = new Date();

        const blog = await Blogs.create({ UserId: userId, title, content, createdAt });
        return res.status(200).json({ data: blog });

    } catch (error) {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})

// 게시글 수정
router.put('/posts/:_postId', loginAuth, async(req, res) => {
    const { _postId } = req.params;
    const { userId } = res.locals.user;
    const { newTitle, newContent } = req.body;

    const detailData = await Blogs.findOne({
        where: { postId: _postId }
    });

    if (!detailData) {
        return res.status(400).json({ message: "게시글 조회에 실패하였습니다." })
    }

    try {
        if (userId !== detailData.UserId) {
            return res.status(403).send({
                errorMessage: "게시글 수정 권한이 존재하지 않습니다."
            })
        }

        const updateBlog = await Blogs.update({
            title: newTitle,
            content: newContent
        }, {
            where: { UserId: userId }
        });

        return res.status(200).json({ message: "게시글을 수정하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
})

// 게시글 삭제
router.delete('/posts/:_postId', loginAuth, async(req, res) => {
    const { _postId } = req.params;
    const { userId } = res.locals.user;
    const detailData = await Blogs.findOne({ where: { postId: _postId } });

    if (!detailData) {
        return res.status(400).json({ message: "게시글 조회에 실패했습니다." })

    }

    try {
        if (userId !== detailData.UserId) {
            return res.status(403).send({
                errorMessage: "게시글 삭제 권한이 없습니다."
            })
        }

        // 기존 : 블로그 글 id 기준으로 댓글 삭제
        // await Promise.all([
        //     Blogs.deleteOne({ _id: _postId }),
        //     Comment.delete({ postid: _postId })
        // ])

        // 신규 : Model CASCADE 관계이므로 별도 설정 필요 없음?
        await Blogs.destroy({ where: { postId: _postId } });

        return res.status(200).json({ message: "게시글을 삭제했습니다." });

    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
})

module.exports = router;