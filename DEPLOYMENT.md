# 🚀 Deployment Guide

This guide covers various deployment options for the Discussion Forum application.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Google Cloud Run](#google-cloud-run)
4. [Render](#render)
5. [Vercel (Frontend)](#vercel-frontend)
6. [Environment Variables](#environment-variables)

---

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

---

## Docker Deployment

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Access
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Custom Configuration
Edit `docker-compose.yml` to customize ports or environment variables:

```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Custom port mapping
```

---

## Google Cloud Run

### Prerequisites
- Google Cloud account
- `gcloud` CLI installed and configured
- Project created in Google Cloud Console

### Backend Deployment

1. **Enable required APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

2. **Deploy backend**
```bash
cd backend
gcloud run deploy discussion-forum-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000
```

3. **Note the service URL** (e.g., https://discussion-forum-backend-xxx.run.app)

### Frontend Deployment

1. **Update frontend config**
Edit `frontend/src/config.js`:
```javascript
export const API_BASE_URL = 'https://your-backend-url.run.app';
```

2. **Build and deploy**
```bash
cd frontend
npm run build

gcloud run deploy discussion-forum-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

### Configure CORS
Update `backend/server.js`:
```javascript
const io = new Server(server, {
  cors: {
    origin: 'https://your-frontend-url.run.app',
    methods: ['GET', 'POST']
  }
});
```

---

## Render

### Prerequisites
- Render account
- GitHub repository connected

### Backend Deployment

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select the repository

2. **Configure Service**
   - Name: `discussion-forum-backend`
   - Region: Choose nearest
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free or Starter

3. **Environment Variables**
   - PORT: 5000 (automatically set)
   - NODE_ENV: production

4. **Deploy**
   - Click "Create Web Service"
   - Note the service URL

### Frontend Deployment

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect repository

2. **Configure**
   - Name: `discussion-forum-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

3. **Environment Variables**
   - REACT_APP_API_URL: `https://your-backend.onrender.com`

4. **Deploy**

### Auto-Deploy
Render automatically deploys on git push to main branch.

---

## Vercel (Frontend)

### Prerequisites
- Vercel account
- Vercel CLI installed: `npm i -g vercel`

### Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel deploy --prod
```

3. **Configure Environment**
```bash
vercel env add REACT_APP_API_URL production
# Enter your backend URL when prompted
```

4. **Redeploy with environment**
```bash
vercel deploy --prod
```

### GitHub Integration
1. Import project in Vercel dashboard
2. Connect GitHub repository
3. Set root directory to `frontend`
4. Configure environment variables
5. Deploy automatically on push

---

## Environment Variables

### Backend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 | Yes |

### Frontend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000 | Yes |

### Setting Environment Variables

#### Local (.env file)
```bash
# backend/.env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# frontend/.env
REACT_APP_API_URL=http://localhost:5000
```

#### Docker Compose
```yaml
services:
  backend:
    environment:
      - PORT=5000
      - FRONTEND_URL=http://localhost
```

#### Cloud Run
```bash
gcloud run deploy SERVICE_NAME \
  --set-env-vars="PORT=5000,FRONTEND_URL=https://your-frontend.run.app"
```

#### Render
Set in dashboard under Environment tab.

#### Vercel
```bash
vercel env add VARIABLE_NAME production
```

---

## Troubleshooting

### CORS Issues
Ensure `FRONTEND_URL` in backend matches your actual frontend URL.

### WebSocket Connection Failed
- Check if backend URL includes protocol (http/https)
- Verify CORS settings allow WebSocket upgrade
- Check firewall/network settings

### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Port Already in Use
```bash
# Find process using port
lsof -ti:5000
# Kill process
kill -9 <PID>
```

### Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker-compose down -v
docker-compose up --build
```

---

## Performance Optimization

### Production Build
```bash
# Frontend
NODE_ENV=production npm run build

# Backend
NODE_ENV=production npm start
```

### Enable Compression (Backend)
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### CDN for Static Assets
Consider using Cloudflare or AWS CloudFront for frontend assets.

---

## Security Checklist

- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable security headers (helmet.js)
- [ ] Regular dependency updates

---

## Monitoring

### Logging
Add structured logging:
```bash
npm install winston
```

### Health Checks
Backend includes `/api/health` endpoint for monitoring.

### Metrics
Consider adding:
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Analytics (Google Analytics, Mixpanel)

---

## Scaling

### Horizontal Scaling
- Cloud Run: Auto-scales based on traffic
- Render: Increase instance count in dashboard
- Docker: Use Docker Swarm or Kubernetes

### Database
Replace in-memory storage with:
- PostgreSQL (recommended for production)
- MongoDB
- Redis (for caching)

---

For additional help, refer to the main [README.md](README.md) or create an issue.


