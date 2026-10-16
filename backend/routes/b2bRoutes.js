import express from 'express';
import { B2BPartner } from '../models/B2BPartner.js';

const router = express.Router();

// GET /api/b2b/partners - Fetch all B2B partner applications
router.get('/', async (req, res) => {
  try {
    const partners = await B2BPartner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching B2B partners', error: error.message });
  }
});

// POST /api/b2b/partners - Submit B2B partner registration form
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = 'B2B-' + Math.floor(1000 + Math.random() * 9000);
    }
    if (!data.submittedAt) {
      const now = new Date();
      data.submittedAt = now.toISOString().replace('T', ' ').slice(0, 16);
    }

    const newPartner = new B2BPartner(data);
    await newPartner.save();
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ message: 'Error registering B2B partner', error: error.message });
  }
});

// PUT /api/b2b/partners/:id - Update status or notes for B2B partner
router.put('/:id', async (req, res) => {
  try {
    const updated = await B2BPartner.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'B2B Partner record not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating B2B Partner', error: error.message });
  }
});

export default router;
