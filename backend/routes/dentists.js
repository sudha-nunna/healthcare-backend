const express = require('express');
const Dentist = require('../models/Dentist');
const adminKey = require('../middleware/adminKey');

const router = express.Router();

function toInt(value, fallback) {
  const n = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// GET /api/dentists?q=&location=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const qText = String(req.query.q || '').trim();
    const location = String(req.query.location || '').trim();
    const page = toInt(req.query.page, 1);
    const limit = Math.min(toInt(req.query.limit, 9), 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (qText) {
      filter.$or = [
        { name: { $regex: qText, $options: 'i' } },
        { qualification: { $regex: qText, $options: 'i' } },
        { clinicName: { $regex: qText, $options: 'i' } },
        { address: { $regex: qText, $options: 'i' } },
        { location: { $regex: qText, $options: 'i' } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const [total, dentists] = await Promise.all([
      Dentist.countDocuments(filter),
      Dentist.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    ]);

    res.json({
      success: true,
      dentists,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/dentists - add dentist (admin key optional)
router.post('/', adminKey, async (req, res, next) => {
  try {
    const {
      name,
      photo,
      qualification,
      experience,
      clinicName,
      address,
      location,
    } = req.body || {};

    if (!name || !clinicName || !address) {
      return res
        .status(400)
        .json({ message: 'name, clinicName and address are required' });
    }

    const dentist = await Dentist.create({
      name,
      photo,
      qualification,
      experience: Number.isFinite(Number(experience)) ? Number(experience) : 0,
      clinicName,
      address,
      location,
    });

    res.status(201).json({ success: true, dentist });
  } catch (err) {
    next(err);
  }
});

// POST /api/dentists/seed - seed example dentists (dev helper)
router.post('/seed', adminKey, async (req, res, next) => {
  try {
    const count = await Dentist.countDocuments();
    if (count > 0) {
      return res
        .status(400)
        .json({ message: 'Dentists already exist, seed not applied' });
    }

    const sampleDentists = [
      {
        name: 'Dr. Ananya Rao',
        photo:
          'https://images.pexels.com/photos/3845765/pexels-photo-3845765.jpeg',
        qualification: 'BDS, MDS (Orthodontics)',
        experience: 8,
        clinicName: 'Bright Smile Dental Care',
        address: '12, MG Road, 2nd Floor',
        location: 'Bengaluru',
      },
      {
        name: 'Dr. Karthik Mehta',
        photo:
          'https://images.pexels.com/photos/4617285/pexels-photo-4617285.jpeg',
        qualification: 'BDS, MDS (Endodontics)',
        experience: 10,
        clinicName: 'City Dental Clinic',
        address: '22, Park Street',
        location: 'Hyderabad',
      },
      {
        name: 'Dr. Priya Sharma',
        photo:
          'https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg',
        qualification: 'BDS, Cosmetic Dentistry',
        experience: 6,
        clinicName: 'Smile Hub Dental Studio',
        address: '45, Lake View Road',
        location: 'Mumbai',
      },
    ];

    const created = await Dentist.insertMany(sampleDentists);
    res.json({ success: true, created });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
