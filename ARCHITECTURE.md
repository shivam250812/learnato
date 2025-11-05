# 🏗️ Architecture Documentation

## System Overview

The Discussion Forum is built as a microservice architecture with clear separation between frontend and backend, connected via REST API and WebSocket for real-time communication.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                 ┌─────────┴──────────┐
                 │                    │
        REST API │              WebSocket
                 │                    │
┌────────────────▼────────────────────▼────────────────────────┐
│                      React Frontend                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Components Layer                                        │ │
│  │  - Header (Navigation)                                   │ │
│  │  - PostList (Browse & Search)                            │ │
│  │  - PostDetail (Read & Reply)                             │ │
│  │  - CreatePost (Compose)                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Services Layer                                          │ │
│  │  - API Client (axios)                                    │ │
│  │  - Socket.io Client                                      │ │
│  │  - State Management (React Hooks)                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                           │
                 ┌─────────┴──────────┐
                 │                    │
        REST API │              WebSocket
                 │                    │
┌────────────────▼────────────────────▼────────────────────────┐
│                   Node.js Backend (Express)                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  API Layer                                               │ │
│  │  - Express Router                                        │ │
│  │  - Middleware (CORS, JSON Parser)                        │ │
│  │  - Error Handling                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Controllers Layer                                       │ │
│  │  - postsController.js (Business Logic)                   │ │
│  │    * Create/Read/Update Posts                            │ │
│  │    * Manage Replies                                      │ │
│  │    * Handle Voting                                       │ │
│  │    * Search Functionality                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Real-time Layer                                         │ │
│  │  - Socket.io Server                                      │ │
│  │  - Event Broadcasting                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Data Layer                                              │ │
│  │  - In-Memory Store (Array)                               │ │
│  │  - Can be replaced with PostgreSQL/MongoDB               │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. App.js (Root Component)
- Manages global state (current user)
- Sets up Router
- Initializes Socket.io connection
- Passes socket instance to child components

```javascript
App
├── Header
└── Routes
    ├── PostList (/)
    ├── PostDetail (/post/:id)
    └── CreatePost (/create)
```

#### 2. Header Component
- Navigation and branding
- New Post button
- User information display
- Responsive design

#### 3. PostList Component
**Responsibilities:**
- Fetch and display all posts
- Search functionality
- Sort by date or votes
- Real-time updates via WebSocket
- Quick upvote from list view

**State Management:**
- `posts` - Array of post objects
- `loading` - Loading indicator
- `sortBy` - Sort preference
- `searchQuery` - Search term
- `filteredPosts` - Computed filtered results

**Real-time Events:**
- Listens: `newPost`, `postUpvoted`, `postAnswered`
- Updates list in real-time

#### 4. PostDetail Component
**Responsibilities:**
- Display full post content
- Show all replies
- Add new replies
- Upvote post
- Mark as answered
- Real-time reply updates

**State Management:**
- `post` - Current post object
- `replyContent` - Reply form input
- `submitting` - Form submission state

**Real-time Events:**
- Listens: `newReply`, `postUpvoted`, `postAnswered`
- Updates post in real-time

#### 5. CreatePost Component
**Responsibilities:**
- Form for creating new posts
- Input validation
- Error handling
- Navigation after creation

**Form Fields:**
- Title (required)
- Content (required)
- Author (auto-filled)

### Backend Architecture

#### 1. Server Layer (server.js)
**Responsibilities:**
- Express app initialization
- Middleware setup (CORS, JSON parsing)
- Socket.io server setup
- Route registration
- Health check endpoint

**Key Features:**
- CORS configuration for frontend
- WebSocket support
- Error handling middleware

#### 2. Routes Layer (routes/posts.js)
**Endpoints:**
```
POST   /api/posts              - Create post
GET    /api/posts              - Get all posts
GET    /api/posts/:id          - Get single post
POST   /api/posts/:id/reply    - Add reply
POST   /api/posts/:id/upvote   - Upvote post
POST   /api/posts/:id/mark-answered - Toggle answered
GET    /api/posts/search/query - Search posts
```

#### 3. Controllers Layer (controllers/postsController.js)

**Data Structure:**
```javascript
Post {
  id: string (UUID)
  title: string
  content: string
  author: string
  votes: number
  replies: Reply[]
  isAnswered: boolean
  createdAt: ISO timestamp
  updatedAt: ISO timestamp
}

Reply {
  id: string (UUID)
  content: string
  author: string
  createdAt: ISO timestamp
}
```

**Functions:**
- `createPost()` - Creates new post and broadcasts
- `getAllPosts()` - Returns posts with sorting
- `getPostById()` - Returns single post with replies
- `addReply()` - Adds reply and broadcasts
- `upvotePost()` - Increments votes and broadcasts
- `markAsAnswered()` - Toggles status and broadcasts
- `searchPosts()` - Filters posts by keyword

#### 4. Real-time Layer (Socket.io)

**Events Emitted:**
```javascript
// New post created
socket.emit('newPost', post)

// Reply added to post
socket.emit('newReply', { postId, reply })

// Post upvoted
socket.emit('postUpvoted', { postId, votes })

// Post answered status changed
socket.emit('postAnswered', { postId, isAnswered })
```

**Connection Handling:**
- Automatic reconnection on disconnect
- Connection logging
- Broadcast to all connected clients

## Data Flow

### Creating a Post

```
User Input
    │
    ▼
CreatePost Component
    │
    │ (POST /api/posts)
    ▼
Express Router
    │
    ▼
postsController.createPost()
    │
    ├─── Validate input
    ├─── Generate UUID
    ├─── Add to data store
    ├─── Broadcast via Socket.io ─────┐
    └─── Return response              │
         │                             │
         ▼                             ▼
    Navigate to PostDetail    PostList (all clients)
                               └─── Updates list in real-time
```

### Upvoting a Post

```
User Click
    │
    ▼
PostList/PostDetail Component
    │
    │ (POST /api/posts/:id/upvote)
    ▼
Express Router
    │
    ▼
postsController.upvotePost()
    │
    ├─── Find post
    ├─── Increment votes
    ├─── Update timestamp
    ├─── Broadcast via Socket.io ─────┐
    └─── Return response              │
         │                             │
         ▼                             ▼
    Update local state        All connected clients
                               └─── Update vote count
```

### Adding a Reply

```
User Submit
    │
    ▼
PostDetail Component
    │
    │ (POST /api/posts/:id/reply)
    ▼
Express Router
    │
    ▼
postsController.addReply()
    │
    ├─── Validate input
    ├─── Generate UUID
    ├─── Add to post.replies[]
    ├─── Update timestamp
    ├─── Broadcast via Socket.io ─────┐
    └─── Return response              │
         │                             │
         ▼                             ▼
    Update local state        PostDetail (all viewers)
    Clear form                 └─── Show new reply
```

## State Management

### Frontend State
- **Component State** (useState)
  - Form inputs
  - Loading states
  - Local UI state

- **Shared State** (props)
  - Socket instance
  - Current user
  - Passed from App.js

- **Derived State** (useMemo/useEffect)
  - Filtered posts
  - Sorted lists
  - Computed values

### Backend State
- **In-Memory Storage**
  - Posts array
  - Can be replaced with database

- **Session State**
  - Socket connections
  - Active users

## Real-time Communication

### Socket.io Implementation

**Client Side:**
```javascript
const socket = io(API_BASE_URL);

// Listen for events
socket.on('newPost', (post) => {
  setPosts(prev => [post, ...prev]);
});

// Connection handling
socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', () => console.log('Disconnected'));
```

**Server Side:**
```javascript
const io = new Server(server, {
  cors: { origin: FRONTEND_URL }
});

// Get io instance in controller
const io = req.app.get('io');

// Broadcast to all clients
io.emit('newPost', newPost);
```

## Security Considerations

### Current Implementation
- CORS configuration
- Input validation
- Error handling
- No sensitive data exposure

### Production Recommendations
1. **Authentication**
   - JWT tokens
   - OAuth integration
   - Session management

2. **Authorization**
   - Role-based access control
   - Owner-only edit/delete

3. **Input Sanitization**
   - XSS prevention
   - SQL injection protection (when using DB)
   - Rate limiting

4. **API Security**
   - Request validation
   - Rate limiting
   - API keys for services

## Scalability

### Current Limitations
- In-memory storage (lost on restart)
- Single server instance
- No caching layer

### Scaling Strategy

**Phase 1: Database Integration**
```
In-Memory Array → PostgreSQL/MongoDB
- Persistent storage
- Query optimization
- Indexing
```

**Phase 2: Caching**
```
Add Redis
- Cache frequently accessed posts
- Session storage
- Real-time data
```

**Phase 3: Load Balancing**
```
Multiple Backend Instances
- Horizontal scaling
- Session sharing
- WebSocket sticky sessions
```

**Phase 4: Microservices**
```
Split Services
- Posts Service
- Users Service
- Notifications Service
- Search Service (Elasticsearch)
```

## Performance Optimization

### Frontend
1. **Code Splitting**
   - Lazy load routes
   - Dynamic imports

2. **Memoization**
   - React.memo for components
   - useMemo for expensive calculations

3. **Debouncing**
   - Search input
   - Scroll events

4. **Image Optimization**
   - Lazy loading
   - WebP format
   - CDN delivery

### Backend
1. **Database Queries**
   - Indexing
   - Query optimization
   - Connection pooling

2. **Caching**
   - Redis for hot data
   - Response caching
   - CDN for static assets

3. **Compression**
   - Gzip/Brotli
   - Minimize payload size

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component logic
- **Integration Tests**: Component interactions
- **E2E Tests**: User workflows

### Backend Testing
- **Unit Tests**: Controller functions
- **Integration Tests**: API endpoints
- **Load Tests**: Performance under load

### Recommended Tools
- Jest (Unit/Integration)
- React Testing Library
- Cypress (E2E)
- Artillery (Load testing)

## Monitoring & Observability

### Metrics to Track
- Request latency
- Error rates
- Active connections
- Memory/CPU usage
- Database query performance

### Logging
- Structured logging (Winston)
- Log aggregation (ELK stack)
- Error tracking (Sentry)

### Monitoring Tools
- Prometheus + Grafana
- New Relic
- DataDog

## Future Enhancements

### Short Term
- [ ] Database integration
- [ ] User authentication
- [ ] Rich text editor
- [ ] Email notifications

### Medium Term
- [ ] File uploads
- [ ] Categories/tags
- [ ] User profiles
- [ ] Comment threading (nested replies)

### Long Term
- [ ] AI-powered suggestions
- [ ] Analytics dashboard
- [ ] Mobile apps (React Native)
- [ ] Multi-language support

## Development Workflow

### Local Development
1. Feature branches
2. Local testing
3. Pull request
4. Code review
5. Merge to main

### CI/CD Pipeline
```
Git Push
  │
  ▼
Run Tests
  │
  ├─── Unit Tests
  ├─── Integration Tests
  └─── Linting
  │
  ▼
Build Docker Images
  │
  ▼
Deploy to Staging
  │
  ▼
Automated E2E Tests
  │
  ▼
Deploy to Production
```

---

This architecture is designed to be:
- **Modular**: Easy to modify individual components
- **Scalable**: Can grow with user base
- **Maintainable**: Clear separation of concerns
- **Testable**: Each layer can be tested independently
- **Extensible**: Easy to add new features

For implementation details, see the [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md).


