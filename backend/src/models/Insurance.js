const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  policyNumber: { type: String, required: true },
  coverage: { type: Map, of: Number }, // serviceId -> coverage amount
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insurance', InsuranceSchema);