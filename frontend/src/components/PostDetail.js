import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const PostDetail = ({ socket, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    // Real-time updates
    const handleNewReply = ({ postId, reply }) => {
      // Check if this reply is for the current post
      if (postId === id) {
        setPost((prev) => {
          // Also check against the actual post's _id for extra safety
          if (prev && (postId === prev._id || postId === prev.id || postId === id)) {
            return {
              ...prev,
              replies: [...prev.replies, reply],
            };
          }
          return prev;
        });
      }
    };

    const handlePostUpvoted = ({ postId, votes }) => {
      if (postId === id) {
        setPost((prev) => {
          if (prev && (postId === prev._id || postId === prev.id || postId === id)) {
            return { ...prev, votes };
          }
          return prev;
        });
      }
    };

    const handlePostAnswered = ({ postId, isAnswered }) => {
      if (postId === id) {
        setPost((prev) => {
          if (prev && (postId === prev._id || postId === prev.id || postId === id)) {
            return { ...prev, isAnswered };
          }
          return prev;
        });
      }
    };

    socket.on('newReply', handleNewReply);
    socket.on('postUpvoted', handlePostUpvoted);
    socket.on('postAnswered', handlePostAnswered);

    return () => {
      socket.off('newReply', handleNewReply);
      socket.off('postUpvoted', handlePostUpvoted);
      socket.off('postAnswered', handlePostAnswered);
    };
  }, [socket, id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${id}/upvote`);
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleMarkAnswered = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/posts/${id}/mark-answered`);
    } catch (error) {
      console.error('Error marking as answered:', error);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/api/posts/${id}/reply`, {
        content: replyContent,
        author: currentUser,
      });
      setReplyContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Post not found</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to discussions
      </button>

      {/* Post Card */}
      <div className="card">
        <div className="flex gap-6">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleUpvote}
              className="p-3 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg
                className="w-8 h-8"
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
            <span className="text-3xl font-bold text-gray-800">{post.votes}</span>
            <span className="text-sm text-gray-500">votes</span>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              {post.isAnswered && (
                <span className="badge bg-green-100 text-green-800">
                  ✓ Answered
                </span>
              )}
            </div>

            <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Posted by {post.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              
              <button
                onClick={handleMarkAnswered}
                className={`btn-secondary text-sm ${
                  post.isAnswered ? 'bg-green-100 text-green-800' : ''
                }`}
              >
                {post.isAnswered ? '✓ Marked as Answered' : 'Mark as Answered'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {/* Reply Form */}
        <form onSubmit={handleSubmitReply} className="mb-8">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            rows="4"
            className="input-field mb-3"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !replyContent.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post Reply'}
          </button>
        </form>

        {/* Replies List */}
        {post.replies.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No replies yet. Be the first to reply!
          </p>
        ) : (
          <div className="space-y-4">
            {post.replies.map((reply, index) => (
              <div
                key={reply.id}
                className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-400"
              >
                <p className="text-gray-800 mb-3 whitespace-pre-wrap">
                  {reply.content}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-primary-600">
                    {reply.author}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;

