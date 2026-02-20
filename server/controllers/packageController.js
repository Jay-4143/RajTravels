/**
 * Package Controller – Full Holidays Module
 */

const Package = require('../models/package');
const PackageInquiry = require('../models/packageInquiry');

/**
 * @desc    Get packages with search & filters
 * @route   GET /api/packages
 * @access  Public
 */
exports.getPackages = async (req, res, next) => {
  try {
    const {
      type, destination, minPrice, maxPrice,
      category, featured, hotDeal,
      sort = 'price', order = 'asc',
      page = 1, limit = 20
    } = req.query;

    const query = { isActive: true };
    if (type) query.type = type;
    if (destination) query.destination = new RegExp(destination, 'i');
    if (category) query.category = { $in: [category] };
    if (featured === 'true') query.featured = true;
    if (hotDeal === 'true') query.hotDeal = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const packages = await Package.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean();
    const total = await Package.countDocuments(query);

    res.json({
      success: true,
      packages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured packages for homepage
 * @route   GET /api/packages/featured
 * @access  Public
 */
exports.getFeaturedPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true, featured: true }).limit(6).lean();
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get hot deal packages
 * @route   GET /api/packages/hot-deals
 * @access  Public
 */
exports.getHotDeals = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true, hotDeal: true }).limit(8).lean();
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get package by ID
 * @route   GET /api/packages/:id
 * @access  Public
 */
exports.getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit package inquiry
 * @route   POST /api/packages/:id/inquiry
 * @access  Public
 */
exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, travelDate, numberOfPeople } = req.body;
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    if (!name || !email || !phone) return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });

    const inquiry = await PackageInquiry.create({
      package: pkg._id,
      user: req.user?.id,
      name, email, phone, message,
      travelDate: travelDate ? new Date(travelDate) : undefined,
      numberOfPeople: numberOfPeople ? parseInt(numberOfPeople) : undefined,
    });

    res.status(201).json({ success: true, message: 'Inquiry submitted', inquiry: { id: inquiry._id } });
  } catch (error) {
    next(error);
  }
};
