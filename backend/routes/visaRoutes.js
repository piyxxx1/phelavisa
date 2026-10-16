import express from 'express';
import mongoose from 'mongoose';
import { Visa } from '../models/Visa.js';

const router = express.Router();

// Helper to build query filter for both string id and MongoDB _id
const buildVisaFilter = (paramId) => {
  if (mongoose.isValidObjectId(paramId)) {
    return { $or: [{ id: paramId }, { _id: paramId }] };
  }
  return { id: paramId };
};

// GET /api/visas - Fetch all visa listings
router.get('/', async (req, res) => {
  try {
    const visas = await Visa.find().sort({ createdAt: -1 });
    res.json(visas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visas', error: error.message });
  }
});

// GET /api/visas/:id - Fetch single visa listing by ID
router.get('/:id', async (req, res) => {
  try {
    const visa = await Visa.findOne(buildVisaFilter(req.params.id));
    if (!visa) {
      return res.status(404).json({ message: 'Visa listing not found' });
    }
    res.json(visa);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visa details', error: error.message });
  }
});

// POST /api/visas - Create new visa listing
router.post('/', async (req, res) => {
  try {
    const visaData = req.body;
    if (!visaData.id) {
      visaData.id = (visaData.country || 'visa').toLowerCase().replace(/\s+/g, '-') + '-visa';
    }

    const existing = await Visa.findOne({ id: visaData.id });
    if (existing) {
      const updated = await Visa.findOneAndUpdate({ id: visaData.id }, visaData, { new: true });
      return res.json(updated);
    }

    const newVisa = new Visa(visaData);
    await newVisa.save();
    res.status(201).json(newVisa);
  } catch (error) {
    res.status(400).json({ message: 'Error saving visa listing', error: error.message });
  }
});

// PUT /api/visas/:id - Update existing visa listing
router.put('/:id', async (req, res) => {
  try {
    const filter = buildVisaFilter(req.params.id);
    const updatedVisa = await Visa.findOneAndUpdate(filter, req.body, {
      new: true,
    });
    if (!updatedVisa) {
      return res.status(404).json({ message: 'Visa listing not found for update' });
    }
    res.json(updatedVisa);
  } catch (error) {
    res.status(400).json({ message: 'Error updating visa listing', error: error.message });
  }
});

// DELETE /api/visas/:id - Delete visa listing
router.delete('/:id', async (req, res) => {
  try {
    const filter = buildVisaFilter(req.params.id);
    const deleted = await Visa.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ message: 'Visa listing not found' });
    }
    res.json({ message: 'Visa listing successfully deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting visa listing', error: error.message });
  }
});

export default router;
