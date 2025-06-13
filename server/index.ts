import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Import routers and middleware with explicit extensions for ESM/node16+ compatibility
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json());

const env = process.env.NODE_ENV || 'development';
const uri = process.env.MONGO_DB_URI || 'mongodb://127.0.0.1:27017/recommendation_app';

if (!uri) {
  throw new Error('Database not connected');
}

mongoose.connect(uri, {})
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection Error', err));

// Graceful shutdown setup
function gracefulShutdown() {
  console.log('Received kill signal, closing gracefully');
  server.close(async () => {
    console.log('closing connections');
    await mongoose.connection.close();
    process.exit(0);
  });

  setTimeout(() => {
    console.error('closing connections forcefully');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: "home route" });
});
app.use('/api', authRouter);

// Error handler (should be after all other routes)
app.use(errorHandler);

// 404 handler (should be last)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: '404 Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running over port: ${PORT} in ${env}`);
});
