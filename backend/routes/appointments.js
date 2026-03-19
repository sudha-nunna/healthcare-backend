const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const Appointment = require('../models/Appointment');

// POST /api/appointments
// body: { userId, doctorId, date: 'YYYY-MM-DD', time: 'HH:mm' }
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId, doctorId, date, time } = req.body;
    if (!userId || !doctorId || !date || !time) return res.status(400).json({ message: 'Missing fields' });

    session.startTransaction();

    // find the timeslot and lock it by querying inside the transaction
    let slot = await TimeSlot.findOne({ doctorId, date, time }).session(session);
    if (!slot) {
      // create default slots for the day then try again
      const generated = [];
      const startHour = 9; const endHour = 17;
      for (let h = startHour; h < endHour; h++) {
        for (let m of [0,30]) {
          const hh = String(h).padStart(2, '0');
          const mm = String(m).padStart(2, '0');
          generated.push({ doctorId, date, time: `${hh}:${mm}` });
        }
      }
      await TimeSlot.insertMany(generated, { ordered: false });
      slot = await TimeSlot.findOne({ doctorId, date, time }).session(session);
      if (!slot) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Slot creation failed' });
      }
    }

    if (slot.isBooked) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // mark slot booked
    slot.isBooked = true;
    await slot.save({ session });

    // create appointment
    const appointment = new Appointment({ userId, doctorId, date, time });
    await appointment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, appointment });
  } catch (err) {
    console.error('Booking error:', err);
    try { await session.abortTransaction(); } catch(e){}
    session.endSession();
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/appointments/:id - cancel appointment (no auth for simplicity; in production use auth)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    // Free the time slot
    await TimeSlot.findOneAndUpdate(
      { doctorId: appointment.doctorId, date: appointment.date, time: appointment.time },
      { $set: { isBooked: false } }
    );
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
