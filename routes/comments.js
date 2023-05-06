const express = require("express");
const Comment = require("../schemas/comments.js");
const loginAuth = require("../middlewares/loginChecker.js")
const router = express.Router();

// 댓글 목록 조회
router.get('/posts/:_postId/comments', async(req, res) => {
    const { _postId } = req.params;
    const comment_list = await Comment.find({ postid: _postId });

    if (comment_list.length === 0) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    try {
        const all_comment_list = await comment_list.map(c => {
            return {
                id: c._id,
                content: c.content
            }
        })

        res.status(200).json({ data: all_comment_list });

    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }
})

// 댓글 생성
router.post('/posts/:_postId/comments', loginAuth, async(req, res) => {
    const { _postId } = req.params;
    const { content } = req.body;
    const user = res.locals.user.nickname;
    const createdAt = new Date();

    if (content.length === 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {
        await Comment.create({ postid: _postId, user, content, createdAt });
        res.status(200).json({ message: "댓글을 생성하였습니다." });

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})

// 댓글 수정
router.put('/posts/:_postId/comments/:_commentId', loginAuth, async(req, res) => {
    const { _postId, _commentId } = req.params;
    const { newContent } = req.body;

    const commentContent = await Comment.findOne({ _id: _commentId });

    if (commentContent.length === 0) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });

    } else if (commentContent.length === 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {
        const user = res.locals.user.nickname;
        if (user !== commentContent.user) {
            return res.status(403).send({
                errorMessage: "댓글 수정 권한이 존재하지 않습니다."
            })
        }

        await Comment.updateOne({ _id: _commentId }, { $set: { content: newContent } });
        return res.status(200).json({ message: "댓글을 수정하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

    }
})

// 댓글 삭제
router.delete('/posts/:_postId/comments/:_commentId', loginAuth, async(req, res) => {
    const { _postId, _commentId } = req.params;

    const commentContent = await Comment.findOne({ _id: _commentId });

    if (commentContent.length === 0) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });

    }

    try {

        const user = res.locals.user.nickname;
        if (user !== commentContent.user) {
            return res.status(403).send({
                errorMessage: "댓글 삭제 권한이 존재하지 않습니다."
            })
        }

        await Comment.deleteOne({ _id: _commentId });
        return res.status(200).json({ "message": "댓글을 삭제하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

    }

})

module.exports = router;