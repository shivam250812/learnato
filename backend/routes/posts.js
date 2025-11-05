const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Post routes
router.post('/', postsController.createPost);
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/:id/reply', postsController.addReply);
router.post('/:id/upvote', postsController.upvotePost);
router.post('/:id/mark-answered', postsController.markAsAnswered);

// Search route
router.get('/search/query', postsController.searchPosts);

module.exports = router;


