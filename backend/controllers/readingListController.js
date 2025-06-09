import ReadingList from '../models/ReadingList.js';

export const getLists = async (req, res) => {
  try {
    const lists = await ReadingList.find({ user: req.user.id });
    res.json(lists);
  } catch (err) {
    console.error('Error fetching reading lists:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const createList = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'List name is required' });
    }

    const list = new ReadingList({
      user: req.user.id,
      name,
      books: []
    });

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    console.error('Error creating reading list:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deleteList = async (req, res) => {
  try {
    const list = await ReadingList.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    await ReadingList.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ msg: 'List deleted' });
  } catch (err) {
    console.error('Error deleting reading list:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const addBookToList = async (req, res) => {
  try {
    const { title, author, completion } = req.body;

    if (!title || !author) {
      return res.status(400).json({ msg: 'Title and author are required' });
    }

    const list = await ReadingList.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    list.books.push({
      title,
      author,
      completion: completion || '0%'
    });

    await list.save();
    res.json(list);
  } catch (err) {
    console.error('Error adding book to list:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, author, completion } = req.body;
    const bookIndex = parseInt(req.params.bookIndex);

    if (!title || !author) {
      return res.status(400).json({ msg: 'Title and author are required' });
    }

    const list = await ReadingList.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    if (bookIndex < 0 || bookIndex >= list.books.length) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    list.books[bookIndex] = {
      title,
      author,
      completion: completion || '0%'
    };

    await list.save();
    res.json(list);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const removeBookFromList = async (req, res) => {
  try {
    const bookIndex = parseInt(req.params.bookIndex);

    const list = await ReadingList.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    if (bookIndex < 0 || bookIndex >= list.books.length) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    list.books.splice(bookIndex, 1);
    await list.save();

    res.json({ msg: 'Book removed from list' });
  } catch (err) {
    console.error('Error removing book from list:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};