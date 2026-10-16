import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, default: 'India' },
  visa: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  quote: { type: String, required: true },
  date: { type: String, default: 'August 2026' },
  initial: { type: String, default: 'P' },
  color: { type: String, default: '#2563eb' },
  avatarUrl: { type: String, default: '' },
  isFeatured: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model('Review', reviewSchema);
