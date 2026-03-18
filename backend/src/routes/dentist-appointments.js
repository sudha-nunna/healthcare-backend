const express = require('express');
const DentistAppointment = require('../models/DentistAppointment');
const adminKey = require('../middleware/adminKey');

const router = express.Router();

function toInt(value, fallback) {
  const n = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function normalizeDateOnly(input) {
  // expects YYYY-MM-DD from frontend date input
  const s = String(input || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

// POST /api/dentist-appointments - create appointment
router.post('/', async (req, res, next) => {
  try {
    const { patientName, age, gender, appointmentDate, dentistName, clinicName } =
      req.body || {};

    if (!patientName || age === undefined || !gender || !appointmentDate || !dentistName || !clinicName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
      return res.status(400).json({ message: 'Age must be between 0 and 120' });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender' });
    }

    const apptDate = normalizeDateOnly(appointmentDate);
    if (!apptDate) {
      return res.status(400).json({ message: 'Invalid appointmentDate (use YYYY-MM-DD)' });
    }

    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (apptDate < todayUtc) {
      return res.status(400).json({ message: 'Appointment date cannot be in the past' });
    }

    const appointment = await DentistAppointment.create({
      patientName,
      age: ageNum,
      gender,
      appointmentDate: apptDate,
      dentistName,
      clinicName,
      status: 'Booked',
    });

    res.status(201).json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
});

// GET /api/dentist-appointments?page=&limit=&status=
router.get('/', async (req, res, next) => {
  try {
    const page = toInt(req.query.page, 1);
    const limit = Math.min(toInt(req.query.limit, 10), 50);
    const skip = (page - 1) * limit;
    const status = String(req.query.status || '').trim();

    const filter = {};
    if (status && ['Booked', 'Completed', 'Cancelled'].includes(status)) {
      filter.status = status;
    }

    const [total, appointments] = await Promise.all([
      DentistAppointment.countDocuments(filter),
      DentistAppointment.find(filter)
        .sort({ appointmentDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      success: true,
      appointments,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/dentist-appointments/:id/status  (admin key optional)
router.put('/:id/status', adminKey, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!['Booked', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await DentistAppointment.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true, appointment: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

