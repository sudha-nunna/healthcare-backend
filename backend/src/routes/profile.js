const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// GET /api/profile - get user profile and appointments
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate('doctorId', 'name specialty hospital')
      .sort({ date: -1, time: -1 });
    res.json({ success: true, user, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile - update user profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updates = { name, email, phone, address };
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;