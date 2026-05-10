# GymLog — Fitness Diary with Social Features

Фитнес-приложение с возможностью выбора мышц на интерактивной схеме тела, ведения дневника тренировок, отслеживания рекордов и социальными функциями в реальном времени.

## 🚀 Features

- **Muscle Atlas** - Интерактивная схема тела (спереди/сзади) с автоматическим подбором упражнений
- **Workout Diary** - Запись тренировок с подходами, повторениями, весом и автоматическим отслеживанием личных рекордов
- **Social Features** - Добавление друзей, разрешение на просмотр дневника, видеть статус онлайн
- **Real-time Updates** - WebSocket для просмотра тренировки друга в реальном времени
- **File Uploads** - Загрузка аватара и фото упражнений через UploadThing
- **Search & Filter** - Фильтрация упражнений по мышце, оборудованию, сложности

## 📊 Tech Stack

### Backend
- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **WebSocket (ws)** - Real-time features
- **UploadThing** - File uploads
- **Jest + Supertest** - Testing

### Frontend
- **Next.js 15** - App Router
- **React 19** - UI
- **Plain CSS** - Styling (no Tailwind)
- **React Testing Library** - Component testing
- **Responsive Design** - Mobile, Tablet, Desktop

## 📋 Project Structure

```
final/
├── backend/                    # Express API + MongoDB
│   ├── src/
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── websocket/         # WebSocket handlers
│   │   └── config/            # Database, environment
│   ├── tests/                 # Jest tests
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities, API calls
│   │   ├── styles/            # CSS modules
│   │   └── context/           # Context API
│   ├── public/                # Static files
│   ├── tests/                 # Tests
│   ├── package.json
│   └── .env.local
│
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Installation

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

See `.env.example` files in backend and frontend folders.

## 📝 API Models

- **User** - 8+ fields: name, email, password, avatar, weight, height, bio, isPublic
- **Exercise** - 6+ fields: name, description, videoUrl, difficulty, type, muscleGroups
- **MuscleGroup** - 4+ fields: name, image, description, bodyPart
- **Workout** - 6+ fields: title, date, duration, notes, isPublic, user
- **WorkoutSet** - 5+ fields: exercise, sets, reps, weight, isRecord, workout
- **FriendRequest** - 3+ fields: sender, receiver, status

## 🧪 Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

Minimum: 10 passing test cases (models, routes, components, API).

## 🚢 Deployment

- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 📄 License

MIT
