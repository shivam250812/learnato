import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const PostList = ({ socket }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  useEffect(() => {
    // Real-time updates
    socket.on('newPost', (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    });

    socket.on('postUpvoted', ({ postId, votes }) => {
      setPosts((prev) =>
        prev.map((post) =>
          (post._id || post.id) === postId ? { ...post, votes } : post
        )
      );
    });

    socket.on('postAnswered', ({ postId, isAnswered }) => {
      setPosts((prev) =>
        prev.map((post) =>
          (post._id || post.id) === postId ? { ...post, isAnswered } : post
        )
      );
    });

    return () => {
      socket.off('newPost');
      socket.off('postUpvoted');
      socket.off('postAnswered');
    };
  }, [socket]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/posts?sortBy=${sortBy}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId, e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${postId}/upvote`);
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  // Helper function to get post ID (supports both _id and id)
  const getPostId = (post) => post._id || post.id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts by title, content, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2"
            >
              <option value="date">Latest</option>
              <option value="votes">Most Voted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'Discussion' : 'Discussions'}
        </h2>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to start a discussion!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Link
              key={getPostId(post)}
              to={`/post/${getPostId(post)}`}
              className="block card hover:border-primary-300 border-2 border-transparent"
            >
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-1">
                  <button
                    onClick={(e) => handleUpvote(getPostId(post), e)}
                    className="p-2 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <span className="text-xl font-bold text-gray-800">
                    {post.votes}
                  </span>
                  <span className="text-xs text-gray-500">votes</span>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    {post.isAnswered && (
                      <span className="badge bg-green-100 text-green-800 flex-shrink-0">
                        ✓ Answered
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                      </span>
                      <span>Posted by {post.author}</span>
                    </div>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;

