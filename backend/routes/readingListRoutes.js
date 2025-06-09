import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  getLists,
  createList,
  deleteList,
  addBookToList,
  updateBook,
  removeBookFromList
} from '../controllers/readingListController.js';

const router = express.Router();

// Reading list operations
router.get('/', auth, getLists);
router.post('/', auth, createList);
router.delete('/:id', auth, deleteList);

// Book operations within lists
router.post('/:id/books', auth, addBookToList);
router.put('/:id/books/:bookIndex', auth, updateBook);
router.delete('/:id/books/:bookIndex', auth, removeBookFromList);

export default router;