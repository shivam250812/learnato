# 🍃 MongoDB Setup Guide

This guide explains how to set up MongoDB for the Discussion Forum application.

## 📋 Table of Contents
1. [Local MongoDB Setup](#local-mongodb-setup)
2. [Docker with MongoDB](#docker-with-mongodb)
3. [MongoDB Atlas (Cloud)](#mongodb-atlas-cloud)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)

---

## 🖥️ Local MongoDB Setup

### Option 1: Install MongoDB Locally

#### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify it's running
mongosh
```

#### Ubuntu/Debian
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

#### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will run as a Windows service
4. Connect using MongoDB Compass or `mongosh`

### Option 2: MongoDB in Docker (Standalone)

```bash
# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0

# Verify it's running
docker ps

# Connect to MongoDB shell
docker exec -it mongodb mongosh
```

---

## 🐳 Docker with MongoDB (Recommended)

The project now includes MongoDB in the docker-compose setup!

### Start Everything with One Command

```bash
# Build and start all services (MongoDB + Backend + Frontend)
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

This will start:
- **MongoDB** on port 27017
- **Backend** on port 5000
- **Frontend** on port 80

### Check Logs
```bash
# All services
docker-compose logs -f

# Just MongoDB
docker-compose logs -f mongodb

# Just backend
docker-compose logs -f backend
```

### Access MongoDB Shell
```bash
docker exec -it discussion-forum-mongodb mongosh
```

### View Data
```javascript
// In MongoDB shell
use discussion-forum
db.posts.find().pretty()
db.posts.countDocuments()
```

### Stop Services
```bash
docker-compose down

# To also remove volumes (deletes data)
docker-compose down -v
```

---

## ☁️ MongoDB Atlas (Cloud)

MongoDB Atlas is MongoDB's cloud service (free tier available).

### Setup Steps

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose "Free Shared Cluster"
   - Select region closest to you
   - Name your cluster

3. **Create Database User**
   - Go to "Database Access"
   - Add new user with password
   - Save credentials securely

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (allow from anywhere)
   - Or add your specific IP

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Update Environment Variable**
   ```bash
   # In backend/.env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/discussion-forum?retryWrites=true&w=majority
   ```

---

## ⚙️ Configuration

### Environment Variables

#### Local Development (`backend/.env`)
```bash
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/discussion-forum

# Or Docker MongoDB
MONGODB_URI=mongodb://mongodb:27017/discussion-forum

# Or MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/discussion-forum
```

### Connection Options

The app automatically falls back to in-memory storage if MongoDB is not available!

```javascript
// backend/config/database.js
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error');
    console.log('⚠️  Falling back to in-memory storage');
    // App continues to work!
  }
};
```

---

## 🗄️ Database Schema

### Post Model
```javascript
{
  title: String,        // Post title (required)
  content: String,      // Post content (required)
  author: String,       // Author name (required)
  votes: Number,        // Vote count (default: 0)
  replies: [            // Array of replies
    {
      content: String,
      author: String,
      createdAt: Date
    }
  ],
  isAnswered: Boolean,  // Answered status (default: false)
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

### Indexes
The schema includes indexes for better performance:
- Text search on title, content, author
- Index on votes (for sorting)
- Index on createdAt (for sorting)

---

## 🔍 Useful MongoDB Commands

### View Collections
```javascript
// In mongosh
use discussion-forum
show collections
```

### Query Posts
```javascript
// Get all posts
db.posts.find().pretty()

// Get posts sorted by votes
db.posts.find().sort({ votes: -1 })

// Search posts
db.posts.find({ title: /node/i })

// Count posts
db.posts.countDocuments()
```

### Update Data
```javascript
// Update a post
db.posts.updateOne(
  { _id: ObjectId("...") },
  { $set: { votes: 10 } }
)

// Delete a post
db.posts.deleteOne({ _id: ObjectId("...") })

// Clear all posts
db.posts.deleteMany({})
```

### Database Management
```javascript
// Show database size
db.stats()

// Drop database (careful!)
db.dropDatabase()
```

---

## 🐛 Troubleshooting

### MongoDB Not Connecting

**Check if MongoDB is running:**
```bash
# macOS/Linux
sudo systemctl status mongod

# Or check if port is open
lsof -i :27017
```

**Test connection:**
```bash
mongosh mongodb://localhost:27017/discussion-forum
```

### Connection Refused

**Problem:** `ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Start MongoDB service:
   ```bash
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod            # Linux
   ```

2. Check if running:
   ```bash
   ps aux | grep mongod
   ```

3. Check logs:
   ```bash
   # macOS
   tail -f /usr/local/var/log/mongodb/mongo.log
   
   # Linux
   sudo tail -f /var/log/mongodb/mongod.log
   ```

### Authentication Failed

**Problem:** Authentication error with MongoDB Atlas

**Solutions:**
1. Verify username/password in connection string
2. Check database user permissions
3. Ensure IP is whitelisted (0.0.0.0/0 for all)
4. URL encode special characters in password

### Docker MongoDB Issues

**Container won't start:**
```bash
# Remove and recreate
docker-compose down -v
docker-compose up --build
```

**Can't connect from backend:**
```bash
# Check network
docker network inspect discussion-forum-network

# Check if MongoDB is ready
docker logs discussion-forum-mongodb
```

### Data Not Persisting

**Check Docker volumes:**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect mongodb_data

# Remove volume (deletes data!)
docker volume rm mongodb_data
```

---

## 📊 Monitoring

### Check Database Size
```javascript
// In mongosh
use discussion-forum
db.stats()
```

### Monitor Performance
```javascript
// See current operations
db.currentOp()

// Database server status
db.serverStatus()
```

### Backup Database

```bash
# Backup
mongodump --db discussion-forum --out ./backup

# Restore
mongorestore --db discussion-forum ./backup/discussion-forum
```

---

## 🚀 Production Recommendations

### Security
- [ ] Enable authentication
- [ ] Use strong passwords
- [ ] Restrict network access
- [ ] Use SSL/TLS connections
- [ ] Regular backups

### Performance
- [ ] Create appropriate indexes
- [ ] Monitor query performance
- [ ] Set up connection pooling
- [ ] Use read replicas for scaling
- [ ] Enable caching

### Monitoring
- [ ] Set up MongoDB Atlas monitoring
- [ ] Configure alerts
- [ ] Track slow queries
- [ ] Monitor disk usage
- [ ] Log analysis

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start local MongoDB | `brew services start mongodb-community` |
| Connect to shell | `mongosh` |
| Start Docker MongoDB | `docker-compose up -d` |
| View logs | `docker-compose logs -f mongodb` |
| Access Docker shell | `docker exec -it discussion-forum-mongodb mongosh` |
| Backup database | `mongodump --db discussion-forum` |
| Stop all services | `docker-compose down` |

---

## ✅ Verification Checklist

After setup, verify:
- [ ] MongoDB is running
- [ ] Backend connects successfully (check logs for ✅)
- [ ] Sample data is seeded
- [ ] Posts are visible in frontend
- [ ] New posts are saved to database
- [ ] Data persists after restart

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB University](https://university.mongodb.com/) - Free courses

---

**Need help?** Check the main [README.md](README.md) or [ARCHITECTURE.md](ARCHITECTURE.md) for more details.


