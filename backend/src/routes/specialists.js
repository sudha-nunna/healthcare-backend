const express = require('express');
const router = express.Router();
const Specialist = require('../models/Specialist');

// GET /api/specialists - list all specialists (optionally filter by specialty)
router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    const q = {};
    if (specialty) {
      // Case-insensitive search and handle variations like "Cardiologist" vs "Cardiology"
      q.specialty = { $regex: new RegExp(specialty, 'i') };
    }
    const list = await Specialist.find(q).sort({ name: 1 }).lean();
    console.log(`Found ${list.length} specialists${specialty ? ` for specialty: ${specialty}` : ''}`);
    res.json({ success: true, specialists: list });
  } catch (err) {
    console.error('Error fetching specialists:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/specialists - create a specialist (simple, no auth for now)
router.post('/', async (req, res) => {
  try {
    const { name, specialty, qualifications, hospital } = req.body;
    if (!name || !specialty) return res.status(400).json({ message: 'Missing fields' });
    const s = new Specialist({ name, specialty, qualifications, hospital });
    await s.save();
    res.json({ success: true, specialist: s });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
