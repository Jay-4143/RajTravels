/**
 * Review Controller
 * Reviews for hotels and packages
 */

const Review = require('../models/review');
const Hotel = require('../models/hotel');
const Package = require('../models/package');

/**
 * @desc    Add review for hotel
 * @route   POST /api/reviews/hotel/:hotelId
 * @access  Private
 */
exports.addHotelReview = async (req, res, next) => {
  try {
    const { rating, title, content, pros, cons } = req.body;
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    const existing = await Review.findOne({ user: req.user.id, hotel: hotel._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this hotel' });

    const review = await Review.create({
      user: req.user.id,
      reviewType: 'hotel',
      hotel: hotel._id,
      rating,
      title,
      content,
      pros: Array.isArray(pros) ? pros : pros ? [pros] : [],
      cons: Array.isArray(cons) ? cons : cons ? [cons] : [],
    });

    // Update hotel rating
    const avg = await Review.aggregate([
      { $match: { hotel: hotel._id, status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (avg[0]) {
      await Hotel.findByIdAndUpdate(hotel._id, { rating: Math.round(avg[0].avg * 10) / 10, reviewCount: avg[0].count });
    }

    res.status(201).json({ success: true, review: { id: review._id, rating: review.rating } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add review for package
 * @route   POST /api/reviews/package/:packageId
 * @access  Private
 */
exports.addPackageReview = async (req, res, next) => {
  try {
    const { rating, title, content, pros, cons } = req.body;
    const pkg = await Package.findById(req.params.packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    const existing = await Review.findOne({ user: req.user.id, package: pkg._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this package' });

    const review = await Review.create({
      user: req.user.id,
      reviewType: 'package',
      package: pkg._id,
      rating,
      title,
      content,
      pros: Array.isArray(pros) ? pros : pros ? [pros] : [],
      cons: Array.isArray(cons) ? cons : cons ? [cons] : [],
    });

    res.status(201).json({ success: true, review: { id: review._id, rating: review.rating } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reviews for hotel
 * @route   GET /api/reviews/hotel/:hotelId
 * @access  Public
 */
exports.getHotelReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find({ hotel: req.params.hotelId, status: 'approved' })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    const total = await Review.countDocuments({ hotel: req.params.hotelId, status: 'approved' });
    res.json({ success: true, reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reviews for package
 * @route   GET /api/reviews/package/:packageId
 * @access  Public
 */
exports.getPackageReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find({ package: req.params.packageId, status: 'approved' })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    const total = await Review.countDocuments({ package: req.params.packageId, status: 'approved' });
    res.json({ success: true, reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};
