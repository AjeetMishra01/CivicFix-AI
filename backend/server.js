import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicfix')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const ensureDefaultAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (!existing) {
      const password = await bcrypt.hash('123456', 10);
      await User.create({
        fullName: 'System Admin',
        email: 'admin@gmail.com',
        password,
        role: 'admin'
      });
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Admin seed error:', error.message);
  }
};

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'CivicFix API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

const startServer = async () => {
  await ensureDefaultAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
