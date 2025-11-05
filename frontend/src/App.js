import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import { API_BASE_URL } from './config';

const socket = io(API_BASE_URL);

function App() {
  const [currentUser] = useState('Guest User');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header currentUser={currentUser} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route 
              path="/" 
              element={<PostList socket={socket} currentUser={currentUser} />} 
            />
            <Route 
              path="/post/:id" 
              element={<PostDetail socket={socket} currentUser={currentUser} />} 
            />
            <Route 
              path="/create" 
              element={<CreatePost currentUser={currentUser} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

