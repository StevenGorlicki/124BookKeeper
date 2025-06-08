import mongoose from 'mongoose';

const BookItem = new mongoose.Schema({
  title: String,
  author: String,
  completion: String
});

const ReadingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listName: { type: String, required: true },
  books: [BookItem]
});

export default mongoose.model('ReadingList', ReadingListSchema);
