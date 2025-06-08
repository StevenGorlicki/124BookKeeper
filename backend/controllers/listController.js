import ReadingList from '../models/ReadingList.js';

export const getLists = async (req, res) => {
  try {
    const lists = await ReadingList.find({ userId: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const createList = async (req, res) => {
  const { listName } = req.body;
  try {
    const newList = new ReadingList({ userId: req.user.id, listName, books: [] });
    const saved = await newList.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const addBookToList = async (req, res) => {
  const { listId } = req.params;
  const { title, author, completion } = req.body;

  try {
    const list = await ReadingList.findOne({ _id: listId, userId: req.user.id });
    if (!list) return res.status(404).json({ msg: 'List not found' });

    list.books.push({ title, author, completion });
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const deleteList = async (req, res) => {
  try {
    const deleted = await ReadingList.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ msg: 'List not found' });
    res.json({ msg: 'List deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
