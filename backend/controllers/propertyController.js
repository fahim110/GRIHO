const Property = require('../models/Property');

// @desc    Get all properties with advanced filtering, searching & sorting
// @route   GET /api/properties
exports.getProperties = async (req, res) => {
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
    console.error('Error in propertyController getProperties:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated stats for hero search & neighborhood quick exploration
// @route   GET /api/properties/stats/overview
exports.getStatsOverview = async (req, res) => {
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
    console.error('Error in propertyController getStatsOverview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Error in propertyController getPropertyById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all properties created by the current logged in landlord
// @route   GET /api/properties/user/my-listings
exports.getMyListings = async (req, res) => {
  try {
    const userPhone = req.user.phone;
    const properties = await Property.find({
      $or: [
        { createdBy: req.user._id },
        { contactPhone: userPhone },
        { contactName: req.user.name },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('Error in propertyController getMyListings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update property availability status
// @route   PUT /api/properties/:id/status
exports.updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Error in propertyController updatePropertyStatus:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create a new rental property listing
// @route   POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;

    if (req.user) {
      propertyData.createdBy = req.user._id;
      if (!propertyData.contactName) propertyData.contactName = req.user.name;
      if (!propertyData.contactPhone) propertyData.contactPhone = req.user.phone;
    }

    const newProperty = await Property.create(propertyData);
    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error('Error in propertyController createProperty:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
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
    console.error('Error in propertyController updateProperty:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error in propertyController deleteProperty:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
