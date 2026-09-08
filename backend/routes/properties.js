const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// @route   GET /api/properties
// @desc    Get all properties with advanced filtering & sorting
router.get('/', async (req, res) => {
  try {
    const {
      search,
      city,
      division,
      area,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      bathrooms,
      gasType,
      tenantPolicy,
      facing,
      lift,
      generatorBackup,
      carParking,
      cctv,
      rooftopAccess,
      featured,
      sort = 'newest',
      page = 1,
      limit = 30,
    } = req.query;

    const filter = {};

    // Text / keyword search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { area: searchRegex },
        { address: searchRegex },
        { city: searchRegex },
      ];
    }

    if (city && city !== 'All') filter.city = new RegExp(city, 'i');
    if (division && division !== 'All') filter.division = new RegExp(division, 'i');
    if (area && area !== 'All') filter.area = new RegExp(area, 'i');
    if (propertyType && propertyType !== 'All') filter.propertyType = propertyType;
    if (gasType && gasType !== 'All') filter.gasType = gasType;
    if (facing && facing !== 'All') filter.facing = facing;

    // Tenant Policy filter (e.g. "Bachelor", "Family")
    if (tenantPolicy && tenantPolicy !== 'All') {
      if (tenantPolicy.toLowerCase().includes('bachelor')) {
        filter.tenantPolicy = { $in: ['Bachelor (Male)', 'Bachelor (Female)', 'Bachelor & Family', 'Students Only', 'Any'] };
      } else if (tenantPolicy.toLowerCase().includes('family')) {
        filter.tenantPolicy = { $in: ['Family Only', 'Bachelor & Family', 'Any'] };
      } else {
        filter.tenantPolicy = tenantPolicy;
      }
    }

    // Rent price range
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    // Bedrooms & Bathrooms
    if (bedrooms && bedrooms !== 'All') {
      const bedNum = Number(bedrooms);
      filter.bedrooms = bedNum >= 4 ? { $gte: 4 } : bedNum;
    }
    if (bathrooms && bathrooms !== 'All') {
      const bathNum = Number(bathrooms);
      filter.bathrooms = bathNum >= 3 ? { $gte: 3 } : bathNum;
    }

    // Amenities filters
    if (lift === 'true') filter['amenities.lift'] = true;
    if (generatorBackup === 'true') filter['amenities.generatorBackup'] = true;
    if (carParking === 'true') filter['amenities.carParking'] = true;
    if (cctv === 'true') filter['amenities.cctv'] = true;
    if (rooftopAccess === 'true') filter['amenities.rooftopAccess'] = true;

    if (featured === 'true') filter.featured = true;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { rent: 1 };
    else if (sort === 'price-desc') sortOptions = { rent: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, reviewCount: -1 };
    else if (sort === 'size-desc') sortOptions = { sizeSqFt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/properties/stats/overview
// @desc    Get aggregated stats for hero search & neighborhood quick exploration
router.get('/stats/overview', async (req, res) => {
  try {
    const totalListings = await Property.countDocuments();
    const bachelorFriendly = await Property.countDocuments({
      tenantPolicy: { $in: ['Bachelor (Male)', 'Bachelor (Female)', 'Bachelor & Family', 'Students Only', 'Any'] },
    });
    const lineGasCount = await Property.countDocuments({ gasType: 'Titas Line Gas' });

    // Top areas with counts
    const areaStats = await Property.aggregate([
      { $group: { _id: '$area', count: { $sum: 1 }, avgRent: { $avg: '$rent' }, minRent: { $min: '$rent' } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      stats: {
        totalListings,
        bachelorFriendly,
        lineGasCount,
        popularAreas: areaStats.map((a) => ({
          name: a._id,
          count: a.count,
          avgRent: Math.round(a.avgRent),
          minRent: a.minRent,
        })),
      },
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Error getting property:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/properties
// @desc    Create a new rental property listing
router.post('/', async (req, res) => {
  try {
    const propertyData = req.body;

    // Set sensible default images if none provided
    if (!propertyData.images || propertyData.images.length === 0) {
      propertyData.images = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      ];
    }

    const newProperty = await Property.create(propertyData);
    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
