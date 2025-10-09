
const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// GET /api/random/med?limit=10&category=someCategory
router.get('/med', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;

    const placeholderImage = "https://placehold.co/160x160/FEE2E2/DC2626?text=No+Image";

    const matchStage = {
      'medicines.image_url': { 
        $exists: true, 
        $ne: "", 
        $nin: [placeholderImage]   // filter out placeholder
      },
      ...(category && { 'medicines.category': category }) // optional category filter
    };

    const randomMedicines = await Brand.aggregate([
      { $unwind: '$medicines' },
      { $match: matchStage },
      { $sample: { size: limit } },
      {
        $project: {
          _id: '$medicines._id',
          name: '$medicines.name',
          brand_name: '$brand_name',
          product_url: '$medicines.product_url',
          image_url: '$medicines.image_url',
          mrp: '$medicines.mrp',
          regularPrice: '$medicines.regularPrice',
          memberPrice: '$medicines.memberPrice',
          manufacturer: '$medicines.manufacturer',
          perUnit: '$medicines.perUnit',
          composition: '$medicines.composition',
          pack_size: '$medicines.pack_size',
          description: '$medicines.description',
          scraped_at: '$medicines.scraped_at',
          suggestions: '$medicines.suggestions'
        }
      }
    ]);

    console.log(`Random results: ${randomMedicines.length} medicines found`);
    res.json(randomMedicines);
  } catch (err) {
    console.error('Error in random medicines:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;
