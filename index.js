const express = require("express");
const app = express();
const port = 3000;

const Blog = require("./schemas/blog.js");
const Comment = require("./schemas/comments.js");

const connect = require("./schemas");
const { default: mongoose } = require("mongoose");
connect();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('This Website for nodejs study');
})

// 게시글 조회
app.get('/post', async(req, res) => {
    const contents = await Blog.find({});
    const data = contents.map(c => {
        return {
            id: c._id,
            user: c.user,
            title: c.title,
            createdAt: c.createdAt
        }
    });

    res.status(200).json({ data: data })
})

// 게시즐 작성 - 오류 반영
app.post('/post', async(req, res) => {
    try {
        const data = {
            user: "Developer",
            password: "1234",
            title: "안녕하세요",
            content: "안녕하세요 content 입니다.",
            createdAt: new Date()
        }
        await Blog.create({...data });
        res.status(200).json({ message: "게시글을 생성하였습니다." });

    } catch (error) {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})

// 게시글 상세 조회
app.get('/posts/:_postId', async(req, res) => {
    const { _postId } = req.params;
    const detail_data = await Blog.find({ _id: _postId });

    if (detail_data.length) {
        return res.status(200).json({ data: detail_data });
    }
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

})

// 게시글 수정
app.put('/posts/:_postId', async(req, res) => {
    const { _postId } = req.params;
    const detail_data = await Blog.find({ _id: _postId });

    const new_password = "1234";
    const new_title = "안녕하세요2";
    const new_content = "안녕하세요 content 입니다.";

    if (detail_data.length === 0) {
        return res.status(400).json({ message: "게시글 조회에 실패하였습니다." })
    }

    try {
        await Blog.updateOne({ _id: _postId }, { $set: { password: new_password, title: new_title, content: new_content } });
        res.status(200).json({ message: "게시글을 수정하였습니다." });

    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
})

// 게시글 삭제
app.delete('/posts/:_postId', async(req, res) => {
    const { _postId } = req.params;
    try {
        const detail_data = await Blog.find({ _id: _postId });

        if (detail_data.length === 0) {
            return res.status(400).json({ message: "게시글 조회에 실패했습니다.." })
        }

        await Blog.deleteOne({ _id: _postId });
        res.status(200).json({ message: "게시글을 삭제했습니다." });

    } catch (error) {

        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
})

// 댓글 생성
app.post('/posts/:_postId/comments', async(req, res) => {
    const { _postId } = req.params;

    const data = {
        postid: _postId,
        user: "Developer",
        password: "1234",
        content: "안녕하세요 댓글입니다.",
        createdAt: new Date()
    };

    if (data.content.length === 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {
        await Comment.create({...data });
        res.status(200).json({ message: "댓글을 생성하였습니다." });

    } catch (error) {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})

// 댓글 목록 조회
app.get('/posts/:_postId/comments', async(req, res) => {
    const { _postId } = req.params;
    const comment_list = await Comment.find({ postid: _postId });

    if (comment_list.length === 0) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    try {
        const all_comment_list = await comment_list.map(c => {
            return {
                commentId: c._id,
                user: c.user,
                content: c.content,
                createdAt: c.createdAt
            }
        })

        res.status(200).json({ data: all_comment_list });

    } catch (error) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

})

// 댓글 수정
app.put('/posts/:_postId/comments/:_commentId', async(req, res) => {
    const { _postId, _commentId } = req.params;

    const new_password = "1234";
    const new_content = "수정된 댓글입니다.";

    const content = await Comment.find({ _id: _postId });

    if (content.length === 0) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });

    } else if (new_content.length === 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    try {
        await Comment.updateOne({ _id: _commentId }, { $set: { password: new_password, content: new_content } });
        return res.status(200).json({ message: "댓글을 수정하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

    }
})

// 댓글 삭제
app.delete('/posts/:_postId/comments/:_commentId', async(req, res) => {
    const { _postId, _commentId } = req.params;

    const content = await Comment.find({ _id: _commentId });

    if (content.length === 0) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });

    }

    try {
        await Comment.deleteOne({ _id: _commentId });
        return res.status(200).json({ "message": "댓글을 삭제하였습니다." });

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });

    }

})


app.listen(port, () => {
    console.log(`Listening at ${port}`);
})