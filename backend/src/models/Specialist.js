const mongoose = require('mongoose');

const SpecialistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  qualifications: { type: String },
  hospital: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  location: { type: String },
  experienceYears: { type: Number, default: 0 },
  services: {
    videoConsultation: { type: Boolean, default: false },
    homeVisit: { type: Boolean, default: false },
    insuranceAccepted: { type: Boolean, default: false },
    weekendAvailability: { type: Boolean, default: false },
    sameDayAppointment: { type: Boolean, default: false }
  },
  isRecommended: { type: Boolean, default: false },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Specialist', SpecialistSchema);
