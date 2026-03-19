const mongoose = require('mongoose');

const DentistAppointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    appointmentDate: { type: Date, required: true },
    dentistName: { type: String, required: true, trim: true },
    clinicName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Booked', 'Completed', 'Cancelled'],
      default: 'Booked',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DentistAppointment', DentistAppointmentSchema);
