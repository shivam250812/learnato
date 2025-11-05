const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discussion-forum';

    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    
    // Seed initial data if database is empty
    const Post = require('../models/Post');
    const count = await Post.countDocuments();
    
    if (count === 0) {
      console.log('📦 Seeding initial data...');
      await seedInitialData();
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Falling back to in-memory storage');
    // Don't exit - let the app continue with in-memory storage
  }
};

// Seed initial sample data
async function seedInitialData() {
  const Post = require('../models/Post');
  
  const samplePosts = [
    {
      title: 'How do I deploy Node.js on Cloud Run?',
      content: 'I\'m trying to deploy my Node.js application on Google Cloud Run but facing some issues. Any help would be appreciated!',
      author: 'Rohan',
      votes: 5,
      replies: [
        {
          content: 'Use gcloud CLI with region flag',
          author: 'Sarah',
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          content: 'Enable Cloud Build first!',
          author: 'Mike',
          createdAt: new Date(Date.now() - 1800000)
        }
      ],
      isAnswered: false,
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      title: 'Best practices for React state management?',
      content: 'What are the current best practices for managing state in large React applications?',
      author: 'Priya',
      votes: 12,
      replies: [
        {
          content: 'Context API for simple cases, Redux for complex apps',
          author: 'John',
          createdAt: new Date(Date.now() - 5400000)
        }
      ],
      isAnswered: true,
      createdAt: new Date(Date.now() - 10800000)
    }
  ];

  await Post.insertMany(samplePosts);
  console.log('✅ Initial data seeded successfully');
}

module.exports = connectDB;

