# 🏗️ System Architecture - Learnato Discussion Forum

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Design](#database-design)
- [Real-time Communication](#real-time-communication)
- [API Design](#api-design)
- [Docker Architecture](#docker-architecture)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## Overview

Learnato is built on a **modern MERN stack** architecture with real-time capabilities. The system follows a **three-tier architecture** pattern:

1. **Presentation Layer** - React.js frontend with Tailwind CSS
2. **Application Layer** - Node.js/Express backend with Socket.io
3. **Data Layer** - MongoDB database with Mongoose ODM

**Architecture Pattern:** Microservices-ready with clear separation of concerns

---

## Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                         │
│                     (React Application)                      │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  │ HTTP/REST             │ WebSocket
                  │                       │
┌─────────────────▼───────────────────────▼───────────────────┐
│                      Nginx Web Server                        │
│              (Production - Static File Serving)              │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           API Proxy Configuration                    │   │
│  │  /api/* ──────────► backend:5000/api/*             │   │
│  │  /socket.io/* ────► backend:5000/socket.io/*       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
┌─────────────────▼───────────────────────▼───────────────────┐
│                 Backend Application Server                   │
│              (Node.js + Express + Socket.io)                 │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Express Middleware Stack              │     │
│  │  • CORS Handler                                    │     │
│  │  • JSON Body Parser                                │     │
│  │  • Error Handler                                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │                  API Routes Layer                  │     │
│  │  • POST   /api/posts                              │     │
│  │  • GET    /api/posts                              │     │
│  │  • GET    /api/posts/:id                          │     │
│  │  • POST   /api/posts/:id/reply                    │     │
│  │  • POST   /api/posts/:id/upvote                   │     │
│  │  • POST   /api/posts/:id/mark-answered            │     │
│  │  • GET    /api/posts/search/query                 │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │            Controllers (Business Logic)            │     │
│  │  • postsController.js                             │     │
│  │    - createPost()                                  │     │
│  │    - getPosts()                                    │     │
│  │    - getPostById()                                 │     │
│  │    - addReply()                                    │     │
│  │    - upvotePost()                                  │     │
│  │    - markAsAnswered()                              │     │
│  │    - searchPosts()                                 │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │          Socket.io Real-time Handler               │     │
│  │  • Connection management                           │     │
│  │  • Event broadcasting                              │     │
│  │  • Room management (future)                        │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          │ Mongoose ODM
                          │
┌─────────────────────────▼─────────────────────────────────┐
│                    MongoDB Database                        │
│                                                             │
│  ┌─────────────────────────────────────────────────┐     │
│  │         Posts Collection (documents)            │     │
│  │  {                                               │     │
│  │    _id: ObjectId                                │     │
│  │    title: String                                │     │
│  │    content: String                              │     │
│  │    author: String                               │     │
│  │    votes: Number                                │     │
│  │    isAnswered: Boolean                          │     │
│  │    replies: [                                   │     │
│  │      {                                          │     │
│  │        content: String                          │     │
│  │        author: String                           │     │
│  │        createdAt: Date                          │     │
│  │      }                                          │     │
│  │    ]                                            │     │
│  │    createdAt: Date                              │     │
│  │  }                                               │     │
│  └─────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
```

### Container Architecture (Docker)

```
┌───────────────────────────────────────────────────────────┐
│                  Docker Host Machine                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │      discussion-forum-network (bridge)              │ │
│  │                                                       │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  Frontend Container                           │  │ │
│  │  │  • Image: nginx:alpine                       │  │ │
│  │  │  • Port: 80                                  │  │ │
│  │  │  • Static files: /usr/share/nginx/html      │  │ │
│  │  │  • Proxy: /api → backend:5000               │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                      ▼                              │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  Backend Container                            │  │ │
│  │  │  • Image: node:18-alpine                     │  │ │
│  │  │  • Port: 5000                                │  │ │
│  │  │  • Environment: production                   │  │ │
│  │  │  • Socket.io server                          │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  │                      ▼                              │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │  MongoDB Container                            │  │ │
│  │  │  • Image: mongo:7.0                          │  │ │
│  │  │  • Port: 27017                               │  │ │
│  │  │  • Volume: mongodb_data (persistent)         │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library for building components |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework |
| **Socket.io-client** | 4.6.0 | WebSocket client for real-time updates |
| **Nginx** | Alpine | Production web server |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18 (Alpine) | JavaScript runtime |
| **Express.js** | 4.18.2 | Web application framework |
| **Socket.io** | 4.6.0 | WebSocket server |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.3.1 | Environment variable management |

### Database & Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 7.0 | NoSQL document database |
| **Docker Volumes** | - | Persistent data storage |

### DevOps & Deployment

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization |
| **Docker Compose** | 3.8 | Multi-container orchestration |

---

## Backend Architecture

### Modular Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection & seeding logic
├── controllers/
│   └── postsController.js    # Business logic & request handlers
├── models/
│   └── Post.js               # Mongoose schema & model
├── routes/
│   └── posts.js              # Route definitions & middleware
└── server.js                 # Application entry point
```

### Layer Responsibilities

#### 1. Server Layer (`server.js`)
**Responsibilities:**
- Initialize Express application
- Configure middleware (CORS, JSON parser)
- Set up Socket.io server
- Register routes
- Start HTTP server

**Key Code:**
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Make Socket.io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postsRouter);

server.listen(PORT);
```

#### 2. Configuration Layer (`config/database.js`)
**Responsibilities:**
- Establish MongoDB connection
- Handle connection errors gracefully
- Seed initial data if database is empty
- Provide fallback mechanisms

**Key Features:**
- ✅ Automatic reconnection
- ✅ Initial data seeding
- ✅ Error handling with fallbacks
- ✅ Connection status logging

#### 3. Model Layer (`models/Post.js`)
**Responsibilities:**
- Define data schema
- Set up validation rules
- Configure indexes
- Define default values

**Schema Design:**
```javascript
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  votes: { type: Number, default: 0 },
  isAnswered: { type: Boolean, default: false },
  replies: [{
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});
```

#### 4. Route Layer (`routes/posts.js`)
**Responsibilities:**
- Define API endpoints
- Map routes to controllers
- Apply route-specific middleware
- Handle HTTP methods

**Routes:**
```javascript
router.get('/', getPosts);                       // List all posts
router.get('/search/query', searchPosts);        // Search posts
router.get('/:id', getPostById);                 // Get single post
router.post('/', createPost);                    // Create post
router.post('/:id/reply', addReply);             // Add reply
router.post('/:id/upvote', upvotePost);          // Upvote post
router.post('/:id/mark-answered', markAsAnswered); // Toggle answered
```

#### 5. Controller Layer (`controllers/postsController.js`)
**Responsibilities:**
- Implement business logic
- Interact with database models
- Broadcast Socket.io events
- Handle errors and edge cases
- Return appropriate HTTP responses

**Example Controller:**
```javascript
exports.createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    
    // Broadcast to all connected clients
    const io = req.app.get('io');
    io.emit('newPost', post);
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Frontend Architecture

### Component Structure

```
frontend/src/
├── components/
│   ├── Header.js         # Navigation & branding
│   ├── PostList.js       # Main posts listing with search/sort
│   ├── PostDetail.js     # Single post view with replies
│   └── CreatePost.js     # New post form modal
├── App.js                # Main component & routing logic
├── config.js             # API base URL configuration
├── index.js              # React DOM rendering
└── index.css             # Global styles & Tailwind imports
```

### Component Hierarchy

```
App
├── Header
└── PostList (Home View)
    ├── CreatePost (Modal)
    └── PostDetail (Detailed View)
```

### State Management

**Approach:** React Hooks (useState, useEffect)

**State Distribution:**
- **PostList:** Posts array, search query, sort option, loading state
- **PostDetail:** Single post, replies, loading state
- **CreatePost:** Form data, submission state

**Data Flow:**
```
User Action → State Update → API Call → Response → State Update → Re-render
                                ↓
                        Socket.io Event Broadcast
                                ↓
                    All Connected Clients Update
```

### Real-time Integration

```javascript
// Socket.io connection
const socket = io(API_BASE_URL);

// Listen for new posts
socket.on('newPost', (post) => {
  setPosts(prevPosts => [post, ...prevPosts]);
});

// Listen for upvotes
socket.on('postUpvoted', ({ postId, votes }) => {
  setPosts(prevPosts => 
    prevPosts.map(p => 
      p._id === postId ? { ...p, votes } : p
    )
  );
});
```

### Component Design Patterns

#### 1. Container/Presentational Pattern
- **Container:** Handles data fetching and state
- **Presentational:** Receives props and renders UI

#### 2. Controlled Components
- Form inputs controlled by React state
- Single source of truth for form data

#### 3. Composition Pattern
- Components composed of smaller reusable components
- Props passed down, events bubbled up

---

## Database Design

### MongoDB Schema Design

#### Posts Collection

```javascript
{
  _id: ObjectId("6540..."),           // Auto-generated unique ID
  title: "How to deploy on Cloud Run?", // Post title
  content: "I'm trying to deploy...",   // Post content
  author: "Rohan",                      // Author name
  votes: 5,                             // Upvote count
  isAnswered: false,                    // Resolved status
  replies: [                            // Embedded replies
    {
      _id: ObjectId("6541..."),         // Reply ID
      content: "Use gcloud CLI",        // Reply content
      author: "Sarah",                  // Reply author
      createdAt: ISODate("2025-11-05")  // Reply timestamp
    }
  ],
  createdAt: ISODate("2025-11-05")     // Post timestamp
}
```

### Design Decisions

#### Why Embedded Replies?

**Chosen Approach:** Embedded documents (replies within posts)

**Pros:**
- ✅ Atomic operations (single query to get post + replies)
- ✅ Better performance for read-heavy operations
- ✅ Data locality (related data stored together)
- ✅ Simpler queries

**Cons:**
- ❌ Document size limit (16MB - not a concern for our use case)
- ❌ Harder to query replies independently

**Alternative:** Referenced documents (separate Replies collection)

**Conclusion:** Embedded design is optimal for this application because:
1. Replies are always viewed with their parent post
2. Reply count per post is manageable
3. Read performance is critical

### Indexing Strategy

```javascript
// Indexes for performance
postSchema.index({ createdAt: -1 });  // Sort by date
postSchema.index({ votes: -1 });      // Sort by popularity
postSchema.index({ title: 'text', content: 'text' }); // Text search
```

---

## Real-time Communication

### Socket.io Architecture

#### Connection Flow

```
Client Connect
     ↓
Server accepts connection
     ↓
Assign socket ID
     ↓
Client listens for events
     ↓
Server broadcasts updates
     ↓
All clients receive events
     ↓
Clients update UI
```

#### Event Types

| Event | Trigger | Payload | Listeners |
|-------|---------|---------|-----------|
| `newPost` | Post created | `Post` object | All clients |
| `newReply` | Reply added | `{ postId, reply }` | All clients |
| `postUpvoted` | Post upvoted | `{ postId, votes }` | All clients |
| `postAnswered` | Status toggled | `{ postId, isAnswered }` | All clients |

#### Implementation

**Server-side:**
```javascript
// In controller
const io = req.app.get('io');
io.emit('newPost', post);  // Broadcast to all clients
```

**Client-side:**
```javascript
socket.on('newPost', (post) => {
  setPosts(prevPosts => [post, ...prevPosts]);
});
```

#### Connection Management

- **Automatic reconnection** on disconnect
- **Connection pooling** for scalability
- **Event namespaces** for future room-based features
- **Heartbeat mechanism** to detect stale connections

---

## API Design

### RESTful Principles

#### Resource-Based URLs
- `/api/posts` - Posts collection
- `/api/posts/:id` - Individual post
- `/api/posts/:id/reply` - Post's replies
- `/api/posts/:id/upvote` - Post's votes

#### HTTP Methods Mapping
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update resources (future)
- `DELETE` - Delete resources (future)

#### Response Format

**Success Response:**
```json
{
  "_id": "6540...",
  "title": "Post title",
  "content": "Post content",
  "votes": 5,
  "replies": []
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

#### HTTP Status Codes
- `200 OK` - Successful GET
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Docker Architecture

### Multi-stage Frontend Build

```dockerfile
# Stage 1: Build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- ✅ Smaller final image (~25MB vs ~400MB)
- ✅ No build tools in production
- ✅ Security (no unnecessary dependencies)
- ✅ Faster deployment

### Service Orchestration

**docker-compose.yml** manages three services:

1. **MongoDB** - Data persistence with named volume
2. **Backend** - Node.js API with environment variables
3. **Frontend** - Nginx serving React build

**Features:**
- Automatic service dependency management
- Internal networking between containers
- Volume persistence for database
- Environment variable injection
- Health checks and restart policies

---

## Security Architecture

### Implemented Security Measures

#### 1. CORS Protection
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST']
}));
```

#### 2. Environment Variables
- Sensitive data (DB URIs) in environment variables
- `.env` files excluded from version control
- Different configs for dev/prod

#### 3. Input Validation
- Mongoose schema validation
- Required field enforcement
- Data type checking

#### 4. Error Handling
- Graceful error responses
- No sensitive data in error messages
- Fallback mechanisms

#### 5. Docker Security
- Non-root user (future enhancement)
- Minimal base images (Alpine)
- No unnecessary ports exposed
- Read-only file systems where possible

---

## Deployment Architecture

### Production Deployment Options

#### Option 1: Railway/Render/Fly.io
```
GitHub Repository
       ↓
   Git Push
       ↓
Platform detects Dockerfiles
       ↓
   Auto Build
       ↓
  Auto Deploy
       ↓
  Live URL ✨
```

#### Option 2: Google Cloud Run
```
Local Development
       ↓
 gcloud run deploy
       ↓
 Cloud Build
       ↓
Container Registry
       ↓
   Cloud Run Service
       ↓
  Auto-scaling ✨
```

### Scalability Considerations

#### Horizontal Scaling
- Stateless backend (can run multiple instances)
- MongoDB clustering for data replication
- Load balancer distribution

#### Vertical Scaling
- Increase container resources
- Optimize database queries
- Add caching layer (Redis)

#### Future Enhancements
- CDN for static assets
- Database read replicas
- Redis for session management
- Message queue for async tasks

---

## Design Patterns Used

### 1. MVC Pattern (Modified)
- **Model:** Mongoose schemas
- **View:** React components
- **Controller:** Express controllers

### 2. Repository Pattern
- Data access abstracted through Mongoose
- Business logic separated from data access

### 3. Observer Pattern
- Socket.io event-driven architecture
- Clients observe server events

### 4. Factory Pattern
- Mongoose model factory
- Component factory in React

### 5. Middleware Pattern
- Express middleware chain
- Request/response processing pipeline

---

## Performance Optimizations

### Backend
- ✅ Mongoose query optimization
- ✅ Database indexing
- ✅ Connection pooling
- ✅ Compression middleware (future)

### Frontend
- ✅ React.memo for component optimization
- ✅ Lazy loading (future)
- ✅ Code splitting (future)
- ✅ Nginx caching for static assets

### Database
- ✅ Proper indexing strategy
- ✅ Embedded documents for locality
- ✅ Efficient query patterns

---

## Monitoring & Observability

### Health Checks
```javascript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Discussion Forum API is running'
  });
});
```

### Logging Strategy
- Connection events logged
- Error messages captured
- Socket.io events tracked

### Future Enhancements
- Structured logging (Winston)
- Error tracking (Sentry)
- Performance monitoring (APM)
- Analytics dashboard

---

## Conclusion

This architecture provides:

✅ **Modularity** - Clear separation of concerns
✅ **Scalability** - Horizontal and vertical scaling options
✅ **Maintainability** - Well-organized codebase
✅ **Performance** - Optimized for read-heavy workloads
✅ **Real-time** - WebSocket for live updates
✅ **Production-Ready** - Docker containerization
✅ **Security** - Multiple security layers

The design follows industry best practices while remaining simple and understandable, making it ideal for educational purposes and future enhancements.

---

**Last Updated:** November 2025
