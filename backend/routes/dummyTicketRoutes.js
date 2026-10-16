import express from 'express';
import { DummyTicket, DummyPricing } from '../models/DummyTicket.js';

const router = express.Router();

// GET /api/dummy-tickets - Fetch all dummy ticket orders
router.get('/', async (req, res) => {
  try {
    const orders = await DummyTicket.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dummy ticket orders', error: error.message });
  }
});

// GET /api/dummy-tickets/user/:email - Fetch dummy ticket orders for specific user email
router.get('/user/:email', async (req, res) => {
  try {
    const emailQuery = req.params.email.toLowerCase().trim();
    const orders = await DummyTicket.find({
      $or: [
        { passengerEmail: new RegExp('^' + emailQuery + '$', 'i') },
        { userEmail: new RegExp('^' + emailQuery + '$', 'i') },
        { email: new RegExp('^' + emailQuery + '$', 'i') },
      ],
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user dummy ticket orders', error: error.message });
  }
});

// POST /api/dummy-tickets - Create new dummy ticket order
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = 'PV-DUMMY-' + Math.floor(100000 + Math.random() * 900000);
    }
    if (!data.pnrCode) {
      data.pnrCode = 'PNR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const newOrder = new DummyTicket(data);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating dummy ticket order', error: error.message });
  }
});

// PUT /api/dummy-tickets/:id - Update dummy ticket order status / PNR / notes
router.put('/:id', async (req, res) => {
  try {
    const updated = await DummyTicket.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Dummy ticket order not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating dummy ticket order', error: error.message });
  }
});

// GET /api/dummy-tickets/settings - Fetch global dummy ticket pricing settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await DummyPricing.findOne({ id: 'global_dummy_pricing' });
    if (!settings) {
      settings = await DummyPricing.create({
        id: 'global_dummy_pricing',
        flightPrice: 499,
        hotelPrice: 399,
        comboPrice: 799,
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dummy pricing settings', error: error.message });
  }
});

// POST /api/dummy-tickets/settings - Update global dummy ticket pricing settings
router.post('/settings', async (req, res) => {
  try {
    const { flightPrice, hotelPrice, comboPrice } = req.body;
    const updated = await DummyPricing.findOneAndUpdate(
      { id: 'global_dummy_pricing' },
      { flightPrice: Number(flightPrice), hotelPrice: Number(hotelPrice), comboPrice: Number(comboPrice) },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error saving dummy pricing settings', error: error.message });
  }
});

export default router;
