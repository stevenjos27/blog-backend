const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    const { text } = req.body;
    try {
        const comment = await Comment.create({
            post: req.params.postId,
            author: req.user.userId,
            text
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

exports.getCommentsForPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.author.toString() !== req.user.userId)
            return res.status(403).json({ error: 'Not authorized' });

        await comment.remove();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};
