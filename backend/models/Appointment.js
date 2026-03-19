const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Specialist' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['booked','cancelled','completed'], default: 'booked' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
