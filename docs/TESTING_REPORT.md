# GymLog Testing Report

Date: 2026-05-18

## Summary

All Jest test suites pass.

```txt
Backend:  9 test suites passed, 31 tests passed
Frontend: 4 test suites passed, 8 tests passed
Total:    13 test suites passed, 39 tests passed
```

## Commands Used

Backend:

```bash
cd backend
npm test -- --watchAll=false
```

Frontend:

```bash
cd frontend
npm test -- --watchAll=false
```

## Backend Tests

### Unit Tests

| Test file | What it checks | Result |
|---|---|---|
| `tests/User.model.test.js` | User model validation, including required email/name/password behavior | Passed |
| `tests/Exercise.model.test.js` | Exercise model validation for required fields and valid exercise data | Passed |
| `tests/jwt.test.js` | JWT helper behavior for token generation and verification | Passed |
| `tests/utils.test.js` | Utility behavior used by the project | Passed |

### Mocked Route Handler Test

| Test file | What it checks | Result |
|---|---|---|
| `tests/authController.mock.test.js` | Mocked Express handler validation before database work | Passed |

### Integration Tests With Supertest

| Test file | What it checks | Result |
|---|---|---|
| `tests/workouts.integration.test.js` | Register, protected workout routes, workout CRUD, owner-only access | Passed |
| `tests/exercises.integration.test.js` | Protected exercise routes, exercise CRUD, search/filter, owner-only list, owner-only update/delete | Passed |
| `tests/friends.integration.test.js` | Friend search, send request, accept request, friend list, public/private friend diary access | Passed |

### WebSocket Integration Test

| Test file | What it checks | Result |
|---|---|---|
| `tests/websocket.integration.test.js` | `ws` realtime auth with JWT, online friends filtering, workout events sent only to friends | Passed |

## Frontend Tests

### React / Client Tests

| Test file | What it checks | Result |
|---|---|---|
| `tests/AuthContext.test.js` | Auth provider renders children correctly | Passed |
| `tests/ExercisesPage.test.js` | Exercises page renders real API data from `/api/exercises` | Passed |
| `tests/FriendsPage.test.js` | Friends page renders real API friend data and online status | Passed |
| `tests/math.test.js` | Basic Jest sanity checks | Passed |

## Latest Backend Output

```txt
PASS tests/websocket.integration.test.js
PASS tests/friends.integration.test.js
PASS tests/workouts.integration.test.js
PASS tests/exercises.integration.test.js
PASS tests/Exercise.model.test.js
PASS tests/User.model.test.js
PASS tests/authController.mock.test.js
PASS tests/jwt.test.js
PASS tests/utils.test.js

Test Suites: 9 passed, 9 total
Tests:       31 passed, 31 total
Snapshots:   0 total
```

Backend coverage summary:

```txt
All files: statements 69.64%, branches 55.7%, functions 82.05%, lines 70.75%
```

## Latest Frontend Output

```txt
PASS tests/math.test.js
PASS tests/AuthContext.test.js
PASS tests/ExercisesPage.test.js
PASS tests/FriendsPage.test.js

Test Suites: 4 passed, 4 total
Tests:       8 passed, 8 total
Snapshots:   0 total
```

Frontend coverage summary:

```txt
All files: statements 38.87%, branches 27.77%, functions 26.82%, lines 40.9%
```

## Requirement Coverage

| Requirement | Covered by |
|---|---|
| Mongoose model validation | `User.model.test.js`, `Exercise.model.test.js` |
| Utility function | `jwt.test.js`, `utils.test.js` |
| Express route handler mocked | `authController.mock.test.js` |
| API endpoint with Supertest | workout, exercise, and friend integration tests |
| React component with Testing Library | `ExercisesPage.test.js`, `FriendsPage.test.js`, `AuthContext.test.js` |
| WebSocket realtime feature | `websocket.integration.test.js` |

## Notes

- Tests require MongoDB to be available at `mongodb://localhost:27017/gymlog-test`.
- The final submission can include this Markdown file as the testing report.
- A screenshot of the terminal after running the two commands above can be attached separately if the instructor asks for an image screenshot.
