import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Allow empty password for Google users
  googleId: { type: String, required: false }, // Optional: store Google ID
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);