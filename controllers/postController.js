const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    const { title, content, tags } = req.body;

    try {
        const newPost = await Post.create({
            title,
            content,
            tags,
            author: req.user.userId
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: `Failed to create post: ${err}` });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name');
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.author.toString() !== req.user.userId)
            return res.status(403).json({ error: 'Not authorized' });

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.author.toString() !== req.user.userId)
            return res.status(403).json({ error: 'Not authorized' });

        await post.remove();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};