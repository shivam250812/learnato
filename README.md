# 💬 Discussion Forum Microservice

A modern, real-time discussion forum built with React.js, Node.js, and Socket.io. Features a clean UI, live updates, and full Docker support for easy deployment.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-18-green)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-3.3-blue)
![Tech Stack](https://img.shields.io/badge/Socket.io-4.6-black)

## 🚀 Features

### Core Features (MVP)
- ✅ **Create Posts** - Start new discussions with title and content
- ✅ **List Posts** - View all discussions sorted by votes or date
- ✅ **View Post Details** - See full post content with all replies
- ✅ **Add Replies** - Engage in discussions with threaded replies
- ✅ **Upvote Posts** - Vote on posts to highlight quality content
- ✅ **Responsive Design** - Optimized for desktop and mobile devices

### Stretch Goals (Implemented)
- 🔴 **Live Updates** - Real-time post/reply updates via WebSocket
- 🔍 **Search Functionality** - Filter posts by keyword
- ✓ **Mark as Answered** - Instructors can mark resolved questions
- 📊 **Sort Options** - Sort by date or vote count
- 🎨 **Modern UI** - Beautiful, intuitive interface with Tailwind CSS

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │ PostList │  │PostDetail│  │  CreatePost   │    │
│  └────┬─────┘  └────┬─────┘  └───────┬───────┘    │
│       └─────────────┴────────────────┘             │
│              │ Socket.io Client │                   │
└───────────────┼──────────────────┼──────────────────┘
                │                  │
                │  WebSocket      │ HTTP/REST
                │                  │
┌───────────────┼──────────────────┼──────────────────┐
│               │   Backend (Node.js + Express)       │
│  ┌────────────▼──────────────────▼─────────────┐   │
│  │         Socket.io Server                     │   │
│  │              REST API                        │   │
│  │  ┌──────────────────────────────────────┐   │   │
│  │  │   Posts Controller                   │   │   │
│  │  │  - CRUD Operations                   │   │   │
│  │  │  - Real-time Broadcasting            │   │   │
│  │  └──────────────────────────────────────┘   │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼───────────────────────────┐   │
│  │       In-Memory Data Store                   │   │
│  │  (Can be replaced with PostgreSQL/MongoDB)   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Tailwind CSS 3, Socket.io-client |
| **Backend** | Node.js 18, Express.js, Socket.io |
| **Database** | MongoDB with Mongoose ODM |
| **Real-time** | Socket.io for WebSocket connections |
| **Deployment** | Docker, Docker Compose |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+ (for local development)
- Docker and Docker Compose (for containerized deployment)

### Option 1: Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd learnato
```

#### 2. Setup MongoDB
See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions.

**Quick start (macOS):**
```bash
brew services start mongodb-community
```

**Or use Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

#### 3. Setup Backend
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000` and connect to MongoDB

#### 4. Setup Frontend (in a new terminal)
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

> **Note:** Sample data is automatically seeded when you first start the backend!

### Option 2: Docker Deployment (Recommended)

#### Build and run with Docker Compose
```bash
docker-compose up --build
```

This will start:
- **MongoDB**: Port 27017
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost

All services are connected and ready to use!

#### Stop the containers
```bash
docker-compose down
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Posts

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/posts` | Get all posts | Query: `?sortBy=date|votes` |
| `GET` | `/posts/:id` | Get single post with replies | - |
| `POST` | `/posts` | Create new post | `{ title, content, author }` |
| `POST` | `/posts/:id/reply` | Add reply to post | `{ content, author }` |
| `POST` | `/posts/:id/upvote` | Upvote a post | - |
| `POST` | `/posts/:id/mark-answered` | Toggle answered status | - |
| `GET` | `/posts/search/query` | Search posts | Query: `?q=keyword` |

#### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |

### Example Requests

#### Create a Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How do I deploy Node.js on Cloud Run?",
    "content": "I need help deploying my application...",
    "author": "John Doe"
  }'
```

#### Add a Reply
```bash
curl -X POST http://localhost:5000/api/posts/1/reply \
  -H "Content-Type: application/json" \
  -d '{
    "content": "You can use gcloud CLI...",
    "author": "Jane Smith"
  }'
```

#### Upvote a Post
```bash
curl -X POST http://localhost:5000/api/posts/1/upvote
```

## 🔌 WebSocket Events

The application uses Socket.io for real-time updates:

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `newPost` | `Post` | Broadcast when a new post is created |
| `newReply` | `{ postId, reply }` | Broadcast when a reply is added |
| `postUpvoted` | `{ postId, votes }` | Broadcast when a post is upvoted |
| `postAnswered` | `{ postId, isAnswered }` | Broadcast when post status changes |

### Connection
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

socket.on('newPost', (post) => {
  console.log('New post created:', post);
});
```

## 🎨 UI/UX Highlights

- **Modern Design** - Clean, professional interface using Tailwind CSS
- **Responsive Layout** - Works seamlessly on all device sizes
- **Real-time Updates** - Instant feedback without page refresh
- **Smooth Animations** - Subtle transitions for better UX
- **Loading States** - Clear feedback during async operations
- **Error Handling** - User-friendly error messages
- **Accessibility** - Semantic HTML and proper ARIA labels

## 📁 Project Structure

```
learnato/
├── backend/
│   ├── controllers/
│   │   └── postsController.js    # Business logic
│   ├── routes/
│   │   └── posts.js              # API routes
│   ├── server.js                 # Express + Socket.io setup
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js         # Navigation header
│   │   │   ├── PostList.js       # Posts listing with search
│   │   │   ├── PostDetail.js     # Single post view
│   │   │   └── CreatePost.js     # New post form
│   │   ├── App.js                # Main app component
│   │   ├── index.js
│   │   ├── index.css             # Tailwind styles
│   │   └── config.js             # API configuration
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf                # Production nginx config
│   └── .dockerignore
├── docker-compose.yml            # Multi-container setup
└── README.md
```

## 🚢 Deployment

### Deploy to Cloud Run (Google Cloud)

#### Backend
```bash
cd backend
gcloud run deploy discussion-forum-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Frontend
```bash
cd frontend
# Build the app
npm run build

# Deploy to Cloud Run
gcloud run deploy discussion-forum-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Render

1. Create a new Web Service for backend
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Repeat for frontend with appropriate commands

### Deploy Frontend to Vercel

```bash
cd frontend
vercel deploy --prod
```

## 🧪 Testing the Application

### Manual Testing Steps

1. **Create a Post**
   - Click "New Post" button
   - Fill in title and content
   - Submit and verify it appears in the list

2. **Test Real-time Updates**
   - Open the app in two browser windows
   - Create a post in one window
   - Verify it appears instantly in the other

3. **Test Upvoting**
   - Click the upvote button
   - Verify vote count increases
   - Check real-time update in other windows

4. **Test Replies**
   - Open a post detail page
   - Add a reply
   - Verify it appears immediately

5. **Test Search**
   - Enter keywords in search box
   - Verify filtered results

6. **Test Sorting**
   - Switch between "Latest" and "Most Voted"
   - Verify posts reorder correctly

## 🎯 Future Enhancements

- [ ] **User Authentication** - Google OAuth, JWT sessions
- [ ] **Database Integration** - PostgreSQL/MongoDB for persistence
- [ ] **Rich Text Editor** - Markdown support for posts
- [ ] **File Uploads** - Attach images/files to posts
- [ ] **Notifications** - Email/push notifications for replies
- [ ] **Categories/Tags** - Organize posts by topics
- [ ] **User Profiles** - View user activity and reputation
- [ ] **AI Assistant** - Suggest similar questions using AI
- [ ] **Moderation Tools** - Flag inappropriate content
- [ ] **Analytics Dashboard** - Track engagement metrics
- [ ] **Comment Voting** - Upvote/downvote replies
- [ ] **Best Answer** - Mark specific reply as solution

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

**⭐ If you find this project useful, please give it a star!**

