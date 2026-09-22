import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/chat.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['X-Session-ID'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Career Assistant Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/chat', chatRoutes);

// Static frontend serving in production
const clientDistPath = path.join(__dirname, '../dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 AI Career Assistant Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api/chat`);
});
