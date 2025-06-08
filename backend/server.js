import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import listRoutes from './routes/listRoutes.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config(); // ✅ Only once

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
    console.log('MongoDB connected');
  })
  .catch((err) => console.log(err));
