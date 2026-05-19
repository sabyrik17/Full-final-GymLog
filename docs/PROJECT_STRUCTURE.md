# Project Structure

This file explains where each part of GymLog lives.

## Root

```txt
final/
|-- backend/
|-- frontend/
|-- docs/
|-- README.md
|-- .gitignore
+-- .env.example
```

Root is only for project-level files. Real application code is split into `backend` and `frontend`.

## Backend

```txt
backend/
|-- src/
|   |-- config/
|   |   |-- database.js
|   |   +-- jwt.js
|   |-- controllers/
|   |   |-- authController.js
|   |   +-- workoutController.js
|   |-- middleware/
|   |   +-- auth.js
|   |-- models/
|   |   |-- User.js
|   |   |-- Exercise.js
|   |   |-- MuscleGroup.js
|   |   |-- Workout.js
|   |   |-- WorkoutSet.js
|   |   +-- FriendRequest.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   +-- workoutRoutes.js
|   |-- websocket/
|   |   +-- handlers.js
|   +-- server.js
|-- tests/
|-- package.json
|-- jest.config.js
+-- .env.example
```

### Backend Folders

`src/config`
: Database connection and JWT helpers.

`src/controllers`
: Main backend logic. Controllers read request data, call models, and return JSON responses.

`src/middleware`
: Auth protection and error handling.

`src/models`
: Mongoose schemas. This is where database structure lives.

`src/routes`
: Express route definitions. Routes connect URLs to controllers.

`src/websocket`
: Real-time `ws` handlers.

`tests`
: Jest tests for models, utilities, mocked handlers, and API integration.

## Frontend

```txt
frontend/
|-- src/
|   |-- app/
|   |   |-- (auth)/
|   |   |-- (pages)/
|   |   |-- auth/
|   |   |-- contacts/
|   |   |-- forgot-password/
|   |   |-- privacy/
|   |   |-- terms/
|   |   |-- layout.js
|   |   |-- page.js
|   |   +-- landing.module.css
|   |-- components/
|   |-- context/
|   |   +-- AuthContext.js
|   |-- lib/
|   |   |-- api.js
|   |   +-- workoutNotes.js
|   +-- styles/
|       +-- globals.css
|-- tests/
|-- package.json
|-- next.config.js
|-- jest.config.js
+-- .env.local.example
```

### Frontend Folders

`src/app`
: Next.js App Router pages.

`src/app/(auth)`
: Real login and register pages.

`src/app/auth`
: Compatibility redirects for old URLs like `/auth/register`.

`src/app/(pages)`
: Protected app pages such as dashboard, atlas, workouts, friends, and profile.

`src/components`
: Shared components such as navigation.

`src/context`
: Global auth state.

`src/lib`
: API helpers and workout API wrapper.

`src/styles`
: Global CSS variables and shared styles.

`tests`
: Frontend Jest / Testing Library tests.

## Important Data Flow

```txt
Frontend page
  -> frontend/src/lib/api.js
  -> Backend route
  -> Controller
  -> Mongoose model
  -> MongoDB
```

Example for workouts:

```txt
frontend/src/app/(pages)/workouts/new/page.js
  -> frontend/src/lib/workoutNotes.js
  -> POST /api/workouts
  -> backend/src/controllers/workoutController.js
  -> Workout + WorkoutSet + Exercise models
```
