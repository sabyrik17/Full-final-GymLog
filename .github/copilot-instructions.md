# GymLog Project Setup Instructions

## Project Overview
GymLog is a MERN + Next.js fitness application with social features, real-time workout tracking, and WebSocket integration.

## Architecture

- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Frontend**: Next.js 15 (App Router) + React 19 + Plain CSS
- **Database**: MongoDB (local or Atlas)
- **Real-time**: WebSocket (ws library)
- **File Uploads**: UploadThing
- **Authentication**: JWT with bcrypt
- **Testing**: Jest + Supertest + React Testing Library

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**Backend runs on**: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**Frontend runs on**: `http://localhost:3000`

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Connection string: `mongodb://localhost:27017/gymlog`

**Option B: MongoDB Atlas**
- Create account at mongodb.com/atlas
- Create cluster and get connection string
- Set `MONGODB_URI` in `.env`

## Features Implemented

### ✅ Core Architecture
- 6 Mongoose models (User, Exercise, MuscleGroup, Workout, WorkoutSet, FriendRequest)
- One-to-many relationship (User → Workouts)
- Many-to-many relationships (Exercise ↔ MuscleGroup, User ↔ User)
- JWT authentication with protected routes
- WebSocket real-time features
- UploadThing file upload integration

### ✅ Frontend Pages
- Landing page with feature overview
- Auth pages (login, register)
- Dashboard (protected)
- Responsive design (mobile, tablet, desktop)

### ✅ Backend API
- Auth routes: register, login, logout, profile
- WebSocket handlers for real-time updates
- Error handling middleware
- JWT middleware for route protection

### ✅ Testing
- Backend tests (models, JWT, utils)
- Frontend tests (components, math utilities)
- Jest configuration for both frontend and backend

## Project Structure

```
final/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & JWT config
│   │   ├── models/          # Mongoose models (User, Exercise, etc)
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & error handling
│   │   ├── websocket/       # WebSocket handlers
│   │   └── server.js        # Express server
│   ├── tests/               # Jest tests
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/      # Login/Register pages
│   │   │   ├── (pages)/     # App pages
│   │   │   ├── layout.js    # Root layout
│   │   │   ├── page.js      # Landing page
│   │   │   └── styles/      # Global CSS
│   │   ├── components/      # React components
│   │   ├── context/         # AuthContext
│   │   └── lib/             # API utilities
│   ├── tests/               # Jest tests
│   ├── public/              # Static files
│   ├── package.json
│   └── .env.local.example
│
└── README.md
```

## Available Scripts

### Backend
```bash
npm run dev        # Start development server with auto-reload
npm start          # Start production server
npm test           # Run tests with coverage
npm test:watch     # Run tests in watch mode
```

### Frontend
```bash
npm run dev        # Start Next.js dev server
npm run build      # Build for production
npm start          # Run production build
npm test           # Run tests
npm test:watch     # Run tests in watch mode
npm run lint       # ESLint check
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

Test files:
- `tests/User.model.test.js` - User model validation
- `tests/Exercise.model.test.js` - Exercise model validation
- `tests/jwt.test.js` - JWT token generation/verification
- `tests/utils.test.js` - Utility functions

### Frontend Tests
```bash
cd frontend
npm test
```

Test files:
- `tests/AuthContext.test.js` - AuthContext provider
- `tests/math.test.js` - Basic math utilities

**Minimum**: 10 passing test cases ✅

## Next Steps

1. ✅ **Completed**: Project structure, models, basic API, auth pages, landing page
2. **TODO**: Implement Exercise endpoint with filtering
3. **TODO**: Create Muscle Atlas component (interactive body diagram)
4. **TODO**: Implement Workout diary system
5. **TODO**: Add search/filter functionality
6. **TODO**: Complete WebSocket real-time features
7. **TODO**: Integrate UploadThing for file uploads
8. **TODO**: Add social features (friends system)
9. **TODO**: Deploy to Vercel (frontend) and Render (backend)

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/gymlog
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=appid_xxxxx
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_UPLOADTHING_APP_ID=appid_xxxxx
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Create service on Render/Railway
3. Set environment variables
4. Deploy

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify `MONGODB_URI` is correct in `.env`

### Frontend/Backend Connection Issues
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check CORS settings in backend

### WebSocket Connection Issues
- Ensure WebSocket port is open (same as HTTP port 5000)
- Check browser console for connection errors

## Notes

- Plain CSS used throughout (no Tailwind)
- App Router used for frontend (no Pages Router)
- All components are responsive (mobile-first approach)
- JWT tokens stored in localStorage (consider moving to httpOnly cookies for production)
- WebSocket integrated with Express server (not separate server)

---

For detailed implementation, see individual README files in `backend/` and `frontend/` folders.
