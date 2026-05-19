import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/auth.js';
import { setupWebSocket } from './websocket/handlers.js';
import authRoutes from './routes/authRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/workouts', workoutRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  await connectDB();
  setupWebSocket(wss);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}`);
  });
}

export { app, server };
export default server;
