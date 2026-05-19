# API Reference

Base URL for local development:

```txt
http://localhost:5000
```

Protected routes require:

```txt
Authorization: Bearer <token>
```

## Auth

### Register

```txt
POST /api/auth/register
```

Body:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

Returns:

```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Login

```txt
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Profile

```txt
GET /api/auth/profile
PUT /api/auth/profile
```

## Workouts

### List Workouts

```txt
GET /api/workouts
```

Returns only the signed-in user's workouts.

### Create Workout

```txt
POST /api/workouts
```

Body:

```json
{
  "title": "Push day",
  "date": "2026-05-17",
  "note": "Workout note",
  "exercises": [
    {
      "name": "Bench Press",
      "details": "80kg x 10",
      "sets": 3,
      "reps": 10,
      "weight": 80
    }
  ]
}
```

### Get One Workout

```txt
GET /api/workouts/:id
```

Only the owner can read it.

### Update Workout

```txt
PUT /api/workouts/:id
```

Only the owner can update it.

### Delete Workout

```txt
DELETE /api/workouts/:id
```

Only the owner can delete it.

## Exercises

### List Exercises

```txt
GET /api/exercises
```

Optional query filters:

```txt
q=<text>
difficulty=beginner|intermediate|advanced
equipment=barbell|dumbbell|cable|machine|bodyweight|kettlebell|bands
type=compound|isolation|cardio|stretching
```

### Create Exercise

```txt
POST /api/exercises
```

Body:

```json
{
  "name": "Bench Press",
  "description": "Chest compound movement",
  "difficulty": "intermediate",
  "type": "compound",
  "equipment": "barbell",
  "mediaUrl": "https://utfs.io/f/bench.mp4"
}
```

### Get One Exercise

```txt
GET /api/exercises/:id
```

### Update Exercise

```txt
PUT /api/exercises/:id
```

Only the creator can update it.

### Delete Exercise

```txt
DELETE /api/exercises/:id
```

Only the creator can delete it.

## Workout Sets

### Add Set

```txt
POST /api/workouts/:id/sets
```

### Update Set

```txt
PUT /api/workouts/:id/sets/:setId
```

### Delete Set

```txt
DELETE /api/workouts/:id/sets/:setId
```

## Friends

### List Friends And Search Users

```txt
GET /api/friends
GET /api/friends?search=<name-or-email>
```

Returns:

```json
{
  "friends": [],
  "searchResults": []
}
```

### Friend Requests

```txt
GET /api/friends/requests
POST /api/friends/request
```

Request body:

```json
{
  "receiverId": "...",
  "message": "Lets train"
}
```

### Accept Or Reject

```txt
PUT /api/friends/:id/accept
PUT /api/friends/:id/reject
```

`:id` is the friend request id.

### Friend Diary

```txt
GET /api/friends/:id/workouts
```

Only accepted friends can open this route. The friend's profile must also have `isPublic: true`.

## WebSocket

Local URL:

```txt
ws://localhost:5000
```

Current backend events:

Client to server:
- `AUTH`
- `TRAINING_START`
- `TRAINING_UPDATE`
- `TRAINING_END`

Server to client:
- `ONLINE_USERS`
- `TRAINING_STATUS`

The client authenticates with the same JWT token used for the REST API. Online users and workout activity are filtered to accepted friends only.
