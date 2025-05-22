const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    addComment,
    getCommentsForPost,
    deleteComment
} = require('../controllers/commentController');

router.post('/:postId', auth, addComment);            // Add comment to a post
router.get('/:postId', getCommentsForPost);           // Get comments for a post
router.delete('/:id', auth, deleteComment);           // Delete comment

module.exports = router;
