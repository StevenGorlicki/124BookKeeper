import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', NoteSchema);
export default Note;
