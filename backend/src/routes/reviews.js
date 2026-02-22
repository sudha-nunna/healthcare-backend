const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Specialist = require('../models/Specialist');

// GET /api/reviews/doctor/:doctorId - get reviews for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const ratings = reviews.map(r => r.rating);
    const average = ratings.length ? 
      ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
    res.json({ 
      success: true, 
      reviews,
      stats: {
        average,
        total: reviews.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews - create a review
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    if (!doctorId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already reviewed this doctor
    const existing = await Review.findOne({
      userId: req.user.id,
      doctorId
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this doctor' });
    }

    const review = new Review({
      userId: req.user.id,
      doctorId,
      rating,
      comment
    });
    await review.save();

    // Update doctor's average rating
    const reviews = await Review.find({ doctorId });
    const average = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
    await Specialist.findByIdAndUpdate(doctorId, {
      $set: { rating: average }
    });

    res.json({ success: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;