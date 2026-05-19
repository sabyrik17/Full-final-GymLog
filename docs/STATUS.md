# Project Status

This file tracks what is already implemented and what is still missing for the final MERN requirements.

## Implemented

### Backend

- Express server.
- MongoDB connection with Mongoose.
- JWT auth helpers.
- Password hashing with `bcryptjs`.
- Protected auth middleware.
- Models:
  - `User`
  - `Exercise`
  - `MuscleGroup`
  - `Workout`
  - `WorkoutSet`
  - `FriendRequest`
- Auth routes:
  - register
  - login
  - logout
  - profile
- Workout CRUD routes.
- Workout owner authorization.
- Exercise CRUD routes.
- Exercise owner authorization for update/delete.
- Exercise search/filter through backend API.
- Friends API:
  - search users
  - send request
  - accept request
  - reject request
  - friend workout access with public diary permission
- Workout exercises saved through `WorkoutSet`.
- Basic WebSocket server with `ws`.
- WebSocket online users broadcast.
- WebSocket online users filtered to friends.
- WebSocket workout activity broadcast filtered to friends.
- WebSocket auth through JWT.
- UploadThing route in Next.js.
- UploadThing avatar endpoint protected by auth.
- UploadThing exercise media endpoint protected by auth.
- Exercise media URL saved on `Exercise.mediaUrl`.

### Frontend

- Next.js App Router.
- CSS Modules / plain CSS.
- Auth context.
- Register page.
- Login page.
- Dashboard page.
- Muscle atlas page.
- Workout calendar/list page.
- Create workout page.
- Edit workout page.
- Friends page with real API data.
- Friend diary page with real workout data.
- Profile page.
- Profile save through backend API.
- Avatar upload UI in profile.
- Exercise media upload UI in workout create/edit forms.
- Exercise library page with create/edit/delete.
- Exercise search/filter UI.
- Exercise media preview for images and videos.
- Frontend WebSocket connection through `RealtimeContext`.
- Dashboard online friends list.
- Dashboard live friends workout activity feed.

### Tests

- Backend model tests.
- Backend JWT tests.
- Backend mocked route handler tests.
- Backend Supertest integration tests for auth, workout CRUD, exercise CRUD, authorization, and filters.
- Backend Supertest integration tests for friends.
- Backend WebSocket integration test for friend-only realtime filtering.
- Frontend basic render/context tests.
- Frontend React Testing Library test for the exercises page.
- Frontend React Testing Library test for the friends page.

Current latest check:

```txt
backend: 31 passing tests
frontend: 8 passing tests
```

## Partially Implemented

- Profile page exists, but more profile tests can be added.

## Not Implemented Yet

- Full file access/visibility rules beyond auth-protected upload.
- Deployment to Vercel/Render.
- Video demo.

## Recommended Next Steps

1. Add more React Testing Library tests for workout/profile flows.
2. Prepare deployment.
3. Record video demo.
