import express from 'express';
import {
  getLists,
  createList,
  addBookToList,
  deleteList
} from '../controllers/listController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getLists);
router.post('/', authMiddleware, createList);
router.post('/:listId/books', authMiddleware, addBookToList);
router.delete('/:id', authMiddleware, deleteList);

export default router;
