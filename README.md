# GymLog

GymLog is a full-stack MERN fitness diary app. Users can register, log in, manage a profile, upload an avatar, create workout notes, manage exercises, use a muscle atlas, add friends, and see friend activity in real time.

## Status

All mandatory code requirements are implemented locally.

Remaining final deliverables:
- Deploy frontend and backend.
- Add deployed URLs to this README.
- Record the 5-10 minute video demo.
- Attach a screenshot of passing Jest output if required by the instructor.

## Features

- JWT register, login, logout.
- Protected API routes and protected frontend pages.
- Editable profile with UploadThing avatar upload.
- Workout CRUD with owner authorization.
- Exercise CRUD with owner authorization.
- Exercise search/filter by name, difficulty, type, and equipment.
- UploadThing exercise media upload for images/videos.
- Muscle atlas with clickable muscle pages.
- Friends API: search users, send requests, accept/reject requests.
- Friend diary access with public/private permission.
- WebSocket realtime with `ws`:
  - online friends list
  - friend workout activity feed
  - JWT-authenticated socket connection
  - events filtered to accepted friends only

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, ws.
- Frontend: Next.js App Router, JavaScript, React Context, CSS Modules / plain CSS.
- Uploads: UploadThing.
- Testing: Jest, Supertest, React Testing Library.

## Requirement Checklist

| Requirement | Status |
|---|---|
| 4+ Mongoose models, 5+ fields each | Done: 6 models |
| One-to-many relationship | Done: `User -> Workout`, `Workout -> WorkoutSet` |
| Many-to-many relationship | Done: `Exercise <-> MuscleGroup`, `User <-> User` friends |
| JWT sign-up/sign-in | Done |
| Password hashing | Done with `bcryptjs` |
| Protected API routes | Done |
| WebSocket with `ws` on same HTTP server | Done |
| Next.js App Router | Done |
| Server and Client Components | Done |
| Plain CSS / CSS Modules | Done |
| Responsive frontend | Done |
| State management | Done with React Context |
| UploadThing, 2 upload types | Done: avatar + exercise media |
| CRUD for 2 resource types | Done: workouts + exercises |
| Proper owner authorization | Done |
| Real-time interaction | Done |
| Online users/active sessions list | Done: online friends |
| Search/filter | Done: exercises and friends search |
| 10+ Jest tests | Done: 39 tests |
| Testing report | Done: `docs/TESTING_REPORT.md` |
| Deployment | Pending |
| Video demo | Pending |

## Mongoose Models

- `User`
- `Exercise`
- `MuscleGroup`
- `Workout`
- `WorkoutSet`
- `FriendRequest`

`MuscleGroup` includes `exerciseCount`, so every model has at least 5 fields excluding `_id`, `__v`, and timestamps.

## Project Structure

```txt
final/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- websocket/
|   |   +-- server.js
|   +-- tests/
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- context/
|   |   |-- lib/
|   |   +-- styles/
|   +-- tests/
|
|-- docs/
+-- README.md
```

More details: [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend local URL:

```txt
http://localhost:5000
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/gymlog
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local URL:

```txt
http://localhost:3000
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=appid_xxxxx
```

## Frontend Routes

- `/register`
- `/login`
- `/dashboard`
- `/atlas`
- `/atlas/[muscleId]`
- `/exercises`
- `/workouts`
- `/workouts/new`
- `/workouts/[id]`
- `/friends`
- `/friends/[id]`
- `/profile`

## Backend Routes

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

Exercises:
- `GET /api/exercises`
- `POST /api/exercises`
- `GET /api/exercises/:id`
- `PUT /api/exercises/:id`
- `DELETE /api/exercises/:id`

Workouts:
- `GET /api/workouts`
- `POST /api/workouts`
- `GET /api/workouts/:id`
- `PUT /api/workouts/:id`
- `DELETE /api/workouts/:id`
- `POST /api/workouts/:id/sets`
- `PUT /api/workouts/:id/sets/:setId`
- `DELETE /api/workouts/:id/sets/:setId`

Friends:
- `GET /api/friends`
- `GET /api/friends/requests`
- `POST /api/friends/request`
- `PUT /api/friends/:id/accept`
- `PUT /api/friends/:id/reject`
- `GET /api/friends/:id/workouts`

Full API notes: [docs/API.md](docs/API.md)

## WebSocket

Local URL:

```txt
ws://localhost:5000
```

Client events:
- `AUTH`
- `TRAINING_START`
- `TRAINING_UPDATE`
- `TRAINING_END`

Server events:
- `ONLINE_USERS`
- `TRAINING_STATUS`

The socket is authenticated with the same JWT token used by REST API routes.

## Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

Latest local result:

```txt
Backend:  9 test suites passed, 31 tests passed
Frontend: 4 test suites passed, 8 tests passed
Total:    13 test suites passed, 39 tests passed
```

Testing report: [docs/TESTING_REPORT.md](docs/TESTING_REPORT.md)

## Deployment

Pending.

Planned deployment:
- MongoDB: MongoDB Atlas
- Backend: Render or Railway
- Frontend: Vercel
- Files: UploadThing

Live URLs will be added here after deployment:

```txt
Frontend: TBD
Backend:  TBD
```

## Video Demo

Pending.

Demo should show:
- register, login, logout
- profile edit and avatar upload
- workout CRUD
- exercise CRUD and filters
- muscle atlas
- exercise media upload
- friends and requests
- realtime online friends and workout activity
