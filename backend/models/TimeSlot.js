const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Specialist' },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm
  isBooked: { type: Boolean, default: false }
});

TimeSlotSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
