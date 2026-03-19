const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

// Helper to generate 30-min slots between 09:00 and 17:00
function generateSlotsForDate(doctorId, date) {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  for (let h = startHour; h < endHour; h++) {
    for (let m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push({ doctorId, date, time: `${hh}:${mm}`, isBooked: false });
    }
  }
  // add final hour 17:00 as end? typically last slot is 16:30
  return slots;
}

// GET /api/slots?doctorId=...&date=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ message: 'doctorId and date required' });

    // Check if slots exist
    let slots = await TimeSlot.find({ doctorId, date }).sort({ time: 1 }).lean();
    if (!slots || slots.length === 0) {
      // auto generate
      const generated = generateSlotsForDate(doctorId, date);
      // insertMany with ordered=false to skip duplicates if any
      try {
        await TimeSlot.insertMany(generated, { ordered: false });
      } catch (e) {
        // ignore duplicate key errors
      }
      slots = await TimeSlot.find({ doctorId, date }).sort({ time: 1 }).lean();
    }

    const available = slots.filter(s => !s.isBooked).map(s => s.time);
    res.json({ success: true, slots: available, allSlots: slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
