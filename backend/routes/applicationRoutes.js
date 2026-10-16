import express from 'express';
import { Application } from '../models/Application.js';

const router = express.Router();

// GET /api/applications - Fetch all user applications
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// GET /api/applications/user/:email - Fetch applications for specific user email
router.get('/user/:email', async (req, res) => {
  try {
    const emailQuery = req.params.email.toLowerCase().trim();
    const apps = await Application.find({
      $or: [
        { applicantEmail: new RegExp('^' + emailQuery + '$', 'i') },
        { userEmail: new RegExp('^' + emailQuery + '$', 'i') },
      ],
    }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user applications', error: error.message });
  }
});

// GET /api/applications/:id - Fetch single application by ID or BookingRefId
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findOne({
      $or: [{ id: req.params.id }, { bookingRefId: req.params.id }],
    });
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
});

// POST /api/applications - Submit new visa application from Frontend
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = 'app-' + Date.now();
    }
    if (!data.bookingRefId) {
      data.bookingRefId = 'PV-' + Math.floor(100000 + Math.random() * 900000);
    }
    if (!data.submittedAt) {
      const now = new Date();
      data.submittedAt = now.toISOString().replace('T', ' ').slice(0, 16);
    }

    const newApp = new Application(data);
    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting application', error: error.message });
  }
});

// PUT /api/applications/:id - Update status or notes for an application
router.put('/:id', async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { bookingRefId: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Application not found for update' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating application', error: error.message });
  }
});

export default router;
