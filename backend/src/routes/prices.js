const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample price data (in production, would be in database)
const prices = {
  'checkup': {
    'City Hospital': 100,
    'Central Clinic': 120,
    'Medical Center': 90
  },
  'xray': {
    'City Hospital': 200,
    'Central Clinic': 180,
    'Medical Center': 220
  }
};

// GET /api/prices - list all services and prices
router.get('/', async (req, res) => {
  try {
    // In production, fetch from database
    res.json({ success: true, prices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/prices/:serviceId - get prices for a specific service
router.get('/:serviceId', async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const servicePrices = prices[serviceId];
    if (!servicePrices) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ success: true, prices: servicePrices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/prices/estimate/:serviceId - get price estimate with insurance
router.get('/estimate/:serviceId', auth, async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const hospital = req.query.hospital;
    
    const servicePrices = prices[serviceId];
    if (!servicePrices || !servicePrices[hospital]) {
      return res.status(404).json({ message: 'Service or hospital not found' });
    }

    const basePrice = servicePrices[hospital];
    // In production: fetch user's insurance and calculate coverage
    const coverage = 0.7; // 70% coverage example
    const estimate = {
      basePrice,
      coverage: coverage * basePrice,
      outOfPocket: (1 - coverage) * basePrice
    };

    res.json({ success: true, estimate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;