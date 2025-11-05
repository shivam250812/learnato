# 🚀 Quick Start Guide

Get the Discussion Forum up and running in minutes!

## 🎯 Choose Your Method

### Option 1: One-Click Docker Start (Recommended)
**Best for:** Quick demo, production-like environment

```bash
./start-docker.sh
```

✨ That's it! Open http://localhost in your browser.

**Requirements:**
- Docker Desktop installed
- 5 minutes for first build

---

### Option 2: Development Mode
**Best for:** Development, hot-reload, debugging

```bash
./start-dev.sh
```

Opens at http://localhost:3000 (auto-opens in browser)

**Requirements:**
- Node.js 18+
- npm installed
- 5 minutes for dependency installation

---

### Option 3: Manual Setup

#### Step 1: Backend
```bash
cd backend
npm install
npm run dev
```

#### Step 2: Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```

---

## ✅ Verify Installation

Once started, you should see:

### Docker Mode
```
✨ Backend: http://localhost:5000
✨ Frontend: http://localhost
```

### Development Mode
```
✨ Backend: http://localhost:5000
✨ Frontend: http://localhost:3000
```

## 🎮 Try It Out

1. **View existing posts** - Two sample posts are pre-loaded
2. **Create a post** - Click "New Post" button
3. **Upvote** - Click the up arrow
4. **Add reply** - Click on a post, add a reply
5. **Search** - Use the search bar
6. **Sort** - Switch between Latest/Most Voted

## 🔥 Test Real-time Features

1. Open the app in **two browser windows** side-by-side
2. Create a post in one window
3. Watch it appear **instantly** in the other window 🎉

Same works for:
- Upvoting
- Adding replies
- Marking as answered

## 🐛 Troubleshooting

### Docker Issues
```bash
# If containers fail to start
docker-compose down
docker-compose up --build

# View logs
docker-compose logs -f
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clean install
rm -rf backend/node_modules frontend/node_modules
rm backend/package-lock.json frontend/package-lock.json
npm cache clean --force

# Reinstall
cd backend && npm install
cd ../frontend && npm install
```

## 📱 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost (Docker) or http://localhost:3000 (Dev) | User interface |
| Backend API | http://localhost:5000/api | REST endpoints |
| Health Check | http://localhost:5000/api/health | Server status |

## 🎨 Features to Try

### ✨ Core Features
- [x] Create discussions
- [x] Browse posts
- [x] Add replies
- [x] Upvote posts
- [x] View post details

### 🔥 Advanced Features
- [x] Real-time updates
- [x] Search posts
- [x] Sort by votes/date
- [x] Mark as answered
- [x] Responsive design

## 📚 Next Steps

After getting it running:

1. **Read the docs**
   - [README.md](README.md) - Full documentation
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to cloud
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details

2. **Customize**
   - Change colors in `frontend/tailwind.config.js`
   - Add database (see README for PostgreSQL/MongoDB)
   - Enable authentication

3. **Deploy**
   - Google Cloud Run
   - Render
   - Vercel (frontend)
   - See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🤝 Need Help?

- Check [README.md](README.md) for detailed docs
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical questions

## 🎉 You're Ready!

Start building awesome discussions! 🚀

---

**Pro Tips:**
- Use Docker for fastest setup
- Development mode for coding
- Check console for real-time events
- Open DevTools to see WebSocket connections


