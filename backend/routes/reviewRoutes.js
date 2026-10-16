import express from 'express';
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// GET all customer reviews
router.get('/', getAllReviews);

// POST create a new review
router.post('/', createReview);

// PUT update existing review by ID
router.put('/:id', updateReview);

// DELETE remove a review by ID
router.delete('/:id', deleteReview);

export default router;
