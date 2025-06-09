import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  completion: String
});

const readingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  books: [bookSchema]
}, { timestamps: true });

export default mongoose.model('ReadingList', readingListSchema);
