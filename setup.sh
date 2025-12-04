#!/bin/bash

# Task Manager Setup Script
# This script sets up the full-stack Task Manager application

set -e

echo "================================================"
echo "  Task Manager - Setup Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${YELLOW}Checking Node.js version...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version must be 18 or higher. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}Node.js version: $(node -v) ✓${NC}"

# Check if Docker is available
echo -e "${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}Docker is installed ✓${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}Docker is not installed. You'll need to provide your own MongoDB instance.${NC}"
    DOCKER_AVAILABLE=false
fi

# Navigate to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install

echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cat > .env << EOF
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Secret - change this in production!
JWT_SECRET=your-super-secret-jwt-key-$(openssl rand -hex 16 2>/dev/null || echo "change-me-in-production")

# JWT Token expiry
JWT_EXPIRES_IN=7d

# Server port
PORT=5000

# Node environment
NODE_ENV=development
EOF
    echo -e "${GREEN}Backend .env file created ✓${NC}"
else
    echo -e "${GREEN}Backend .env file already exists ✓${NC}"
fi

cd ..

echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    cat > .env << EOF
# API Base URL
VITE_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}Frontend .env file created ✓${NC}"
else
    echo -e "${GREEN}Frontend .env file already exists ✓${NC}"
fi

cd ..

echo ""
echo "================================================"
echo -e "${GREEN}  Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "1. Start MongoDB with Docker:"
    echo "   ${YELLOW}npm run docker:up${NC}"
    echo ""
fi

echo "2. Seed the admin user:"
echo "   ${YELLOW}npm run seed${NC}"
echo ""
echo "3. Start the development server:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "4. Open your browser to:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "Demo Admin Credentials:"
echo "   Email: admin@example.com"
echo "   Password: Admin123"
echo ""
echo "================================================"
