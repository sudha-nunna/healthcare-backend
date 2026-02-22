const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Insurance = require('../models/Insurance');

// GET /api/insurance - get user's insurance info
router.get('/', auth, async (req, res) => {
  try {
    const insurance = await Insurance.findOne({ userId: req.user.id });
    res.json({ success: true, insurance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/insurance - create/update insurance info
router.post('/', auth, async (req, res) => {
  try {
    const { provider, policyNumber, coverage, validFrom, validTo } = req.body;
    const insurance = await Insurance.findOneAndUpdate(
      { userId: req.user.id },
      {
        provider,
        policyNumber,
        coverage,
        validFrom,
        validTo,
        userId: req.user.id
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, insurance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/insurance/verify - verify coverage for a service
router.post('/verify', auth, async (req, res) => {
  try {
    const { serviceId, cost } = req.body;
    const insurance = await Insurance.findOne({ userId: req.user.id });
    if (!insurance) {
      return res.json({
        success: true,
        covered: false,
        message: 'No insurance found'
      });
    }
    // Simple coverage calculation - in reality would call insurance API
    const coverage = insurance.coverage || {};
    const covered = coverage[serviceId] || 0;
    const outOfPocket = Math.max(0, cost - covered);
    res.json({
      success: true,
      covered: true,
      coverage: covered,
      outOfPocket,
      total: cost
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;