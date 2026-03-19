const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    qualification: { type: String, trim: true },
    experience: { type: Number, default: 0, min: 0 },
    clinicName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dentist', DentistSchema);
