# Task Manager

A full-stack Task Management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **Role-based Access**: Admin and User roles (only admins can delete tasks)
- **Task Management**: Create, read, update, and delete tasks
- **Status Tracking**: Toggle tasks between Pending and Completed
- **Server-side Pagination**: Efficient handling of large task lists
- **Status Filtering**: Filter tasks by status
- **Dark/Light Theme**: Persistent theme preference
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend
- Node.js (v18+)
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- Vite + React 18
- TypeScript
- Tailwind CSS v3
- shadcn/ui components
- Axios for API calls
- React Router v6

## Project Structure

```
task-manager/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Auth and role middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── scripts/          # Seed script
│   ├── validators/       # Input validators
│   ├── server.js         # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # Auth and Theme contexts
│   │   ├── lib/          # Utilities and Axios instance
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── index.html
│   └── package.json
├── docker-compose.yml    # MongoDB container
├── setup.sh              # Setup script
├── package.json          # Root package with scripts
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Docker (optional, for MongoDB)
- MongoDB (if not using Docker)

### Installation

1. **Clone and setup:**
   ```bash
   cd task-manager
   chmod +x setup.sh
   ./setup.sh
   ```

   Or manually:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment variables:**

   Backend (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   ```

   Frontend (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start MongoDB:**
   ```bash
   # Using Docker
   npm run docker:up

   # Or use your own MongoDB instance
   ```

4. **Seed admin user:**
   ```bash
   npm run seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend in development mode |
| `npm run dev:backend` | Run only backend |
| `npm run dev:frontend` | Run only frontend |
| `npm run build` | Build frontend for production |
| `npm run start` | Start backend in production mode |
| `npm run seed` | Create admin user in database |
| `npm run docker:up` | Start MongoDB container |
| `npm run docker:down` | Stop MongoDB container |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (paginated) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Toggle task status |
| DELETE | `/api/tasks/:id` | Delete task (admin only) |

### Query Parameters for GET /api/tasks
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status: 'Pending', 'Completed', or 'all'

## Demo Credentials

After running the seed script:

- **Admin Account:**
  - Email: admin@example.com
  - Password: Admin123

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`.

### Backend Production
```bash
# Set environment variables
export NODE_ENV=production
export MONGODB_URI=your-production-mongodb-uri
export JWT_SECRET=your-secure-secret

# Start server
cd backend
npm start
```

### Environment Variables for Production

Make sure to set secure values for:
- `JWT_SECRET` - Use a long, random string
- `MONGODB_URI` - Your production MongoDB connection string
- `NODE_ENV=production`

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token expiration
- Protected routes on frontend and backend
- Role-based authorization
- Input validation and sanitization
- CORS configuration

## License

MIT
