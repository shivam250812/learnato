#!/bin/bash

# Discussion Forum - Docker Startup Script

echo "🐳 Starting Discussion Forum with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "✅ Docker version: $(docker --version)"
echo "✅ Docker Compose version: $(docker-compose --version)"
echo ""

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

echo "🔧 Building and starting containers..."
echo ""

# Build and start containers
docker-compose up --build

# This will keep running until Ctrl+C
# When stopped, the cleanup message is shown
trap "echo ''; echo '🛑 Stopping containers...'; docker-compose down; exit 0" INT

wait


