// backend/controllers/noteController.js
import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch notes' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { bookTitle, author, content } = req.body;
    const note = new Note({ user: req.user.id, bookTitle, author, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Failed to create note' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { bookTitle, author, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { bookTitle, author, content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Failed to update note' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ msg: 'Failed to delete note' });
  }
};
