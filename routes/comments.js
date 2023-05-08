const express = require("express");
const { Users, Blogs, Comments } = require("../models");
const loginAuth = require("../middlewares/loginChecker.js")
const router = express.Router();
// const Comment = require("../schemas/comments.js");

// 댓글 목록 조회
router.get('/posts/:_postId/comments', async(req, res) => {
    const { _postId } = req.params;
    const commentList = await Comments.findAll({
        where: { PostId: _postId }
    });

    if (commentList.length === 0) {
        return res.status(400).json({ message: "게시글을 찾을 수 없습니다." })
    }

    return res.status(200).json({ data: commentList });

})

// 댓글 생성
router.post('/posts/:_postId/comments', loginAuth, async(req, res) => {
    const { _postId } = req.params;
    const { comments } = req.body;
    const { userId } = res.locals.user;
    const createdAt = new Date();

    if (comments.length === 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {

        const content = await Comments.create({ PostId: _postId, UserId: userId, comments, createdAt });
        res.status(200).json({ data: content });

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})

// 댓글 수정
router.put('/posts/:_postId/comments/:_commentId', loginAuth, async(req, res) => {
    const { _postId, _commentId } = req.params;
    const { userId } = res.locals.user;
    const { newComment } = req.body;

    const commentContent = await Comments.findOne({
        where: { commentsId: _commentId }
    });

    if (newComment.length === 0) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });

    } else if (newComment.length === 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {
        if (userId !== commentContent.UserId) {
            return res.status(403).send({
                errorMessage: "댓글 수정 권한이 존재하지 않습니다."
            })
        }

        await Comments.update({
            comments: newComment
        }, { where: { commentsId: _commentId } });

        return res.status(200).json({ message: "댓글을 수정하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

    }
})

// 댓글 삭제
router.delete('/posts/:_postId/comments/:_commentId', loginAuth, async(req, res) => {
    const { _postId, _commentId } = req.params;
    const { userId } = res.locals.user;

    const commentContent = await Comments.findOne({
        where: { commentsId: _commentId }
    });

    if (!commentContent) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });
    }

    try {
        if (userId !== commentContent.UserId) {
            return res.status(403).send({
                errorMessage: "댓글 삭제 권한이 존재하지 않습니다."
            })
        }

        await Comments.destroy({ where: { commentsId: _commentId } });
        return res.status(200).json({ "message": "댓글을 삭제하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

    }
})

module.exports = router;