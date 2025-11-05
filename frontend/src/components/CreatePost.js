import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CreatePost = ({ currentUser }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${API_BASE_URL}/api/posts`, {
        title: title.trim(),
        content: content.trim(),
        author: currentUser,
      });
      
      // MongoDB uses _id, fallback to id for compatibility
      const postId = response.data._id || response.data.id;
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
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

      {/* Form Card */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Start a New Discussion
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How do I deploy Node.js on Cloud Run?"
              className="input-field"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more details about your question or topic..."
              rows="8"
              className="input-field"
              disabled={submitting}
            />
            <p className="mt-2 text-sm text-gray-500">
              Be as specific as possible to get better responses.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Posting as <span className="font-medium">{currentUser}</span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || !title.trim() || !content.trim()}
              >
                {submitting ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tips Card */}
      <div className="card mt-6 bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Tips for a great post
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use a clear, descriptive title that summarizes your question</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Provide context and any relevant details</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Include error messages or specific challenges you're facing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Be respectful and follow community guidelines</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;

