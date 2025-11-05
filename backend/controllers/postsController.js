const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ 
        error: 'Title, content, and author are required' 
      });
    }

    const newPost = new Post({
      title,
      content,
      author,
      votes: 0,
      replies: [],
      isAnswered: false
    });

    await newPost.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('newPost', newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const { sortBy = 'date' } = req.query;
    
    let sortOption = {};
    
    if (sortBy === 'votes') {
      sortOption = { votes: -1, createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const posts = await Post.find().sort(sortOption);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Add a reply to a post
exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).json({ 
        error: 'Content and author are required' 
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newReply = {
      content,
      author,
      createdAt: new Date()
    };

    post.replies.push(newReply);
    await post.save();

    // Get the newly added reply with its generated ID
    const addedReply = post.replies[post.replies.length - 1];

    // Emit real-time update (use _id for MongoDB)
    const io = req.app.get('io');
    io.emit('newReply', { postId: post._id.toString(), reply: addedReply });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error adding reply:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Upvote a post
exports.upvotePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Emit real-time update (use _id for MongoDB)
    const io = req.app.get('io');
    io.emit('postUpvoted', { postId: post._id.toString(), votes: post.votes });

    res.json(post);
  } catch (error) {
    console.error('Error upvoting post:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Mark post as answered
exports.markAsAnswered = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isAnswered = !post.isAnswered;
    await post.save();

    // Emit real-time update (use _id for MongoDB)
    const io = req.app.get('io');
    io.emit('postAnswered', { postId: post._id.toString(), isAnswered: post.isAnswered });

    res.json(post);
  } catch (error) {
    console.error('Error marking post as answered:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Search posts
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.json(posts);
    }

    // Use MongoDB text search or regex
    const searchRegex = new RegExp(q, 'i');
    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { author: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: error.message });
  }
};
