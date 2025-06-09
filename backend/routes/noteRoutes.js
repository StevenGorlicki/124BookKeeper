// backend/routes/noteRoutes.js
import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController.js';
import { googleLogin } from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getNotes);
router.post('/', authMiddleware, createNote);
router.put('/:id', authMiddleware, updateNote);  // ✅ now added
router.delete('/:id', authMiddleware, deleteNote);
router.post('/google', googleLogin); // <-- Add this

export default router;
