/**
 * Admin Controller
 * CRUD for all entities, dashboard, user management
 */

const User = require('../models/user');
const Flight = require('../models/flight');
const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Package = require('../models/package');
const Visa = require('../models/visa');
const VisaApplication = require('../models/visaApplication');
const Booking = require('../models/booking');
const Payment = require('../models/payment');
const PackageInquiry = require('../models/packageInquiry');
const BusBooking = require('../models/busBooking');
const CabBooking = require('../models/cabBooking');
const CruiseBooking = require('../models/cruiseBooking');
const VisaInquiry = require('../models/visaInquiry');

/**
 * @desc    Dashboard analytics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalRevenue,
      flightBookings,
      hotelBookings,
      packageBookings,
      busBookings,
      cabBookings,
      cruiseBookings,
      packageInquiries,
      visaInquiries
    ] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments({ status: { $nin: ['cancelled'] } }),
      Booking.aggregate([{ $match: { status: { $in: ['confirmed', 'completed'] } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Booking.countDocuments({ bookingType: 'flight', status: { $nin: ['cancelled'] } }),
      Booking.countDocuments({ bookingType: 'hotel', status: { $nin: ['cancelled'] } }),
      Booking.countDocuments({ bookingType: 'package', status: { $nin: ['cancelled'] } }),
      BusBooking.countDocuments({ status: { $nin: ['cancelled'] } }),
      CabBooking.countDocuments({ bookingStatus: { $ne: 'Cancelled' } }),
      CruiseBooking.countDocuments({ status: { $nin: ['cancelled'] } }),
      PackageInquiry.countDocuments(),
      VisaInquiry.countDocuments(),
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalBookings: totalBookings + busBookings + cabBookings + cruiseBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        byType: {
          flights: flightBookings,
          hotels: hotelBookings,
          packages: packageBookings,
          buses: busBookings,
          cabs: cabBookings,
          cruises: cruiseBookings
        },
        inquiries: {
          packages: packageInquiries,
          visas: visaInquiries
        },
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== FLIGHTS ====================
exports.addFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, message: 'Flight added', flight });
  } catch (error) {
    next(error);
  }
};

exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
    res.json({ success: true, flight });
  } catch (error) {
    next(error);
  }
};

exports.deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
    res.json({ success: true, message: 'Flight deactivated' });
  } catch (error) {
    next(error);
  }
};

// ==================== HOTELS ====================
exports.addHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, message: 'Hotel added', hotel });
  } catch (error) {
    next(error);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (error) {
    next(error);
  }
};

exports.deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Hotel deactivated' });
  } catch (error) {
    next(error);
  }
};

// ==================== ROOMS ====================
exports.addRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, message: 'Room added', room });
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// ==================== PACKAGES ====================
exports.addPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, message: 'Package added', package: pkg });
  } catch (error) {
    next(error);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

exports.deletePackage = async (req, res, next) => {
  try {
    await Package.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Package deactivated' });
  } catch (error) {
    next(error);
  }
};

// ==================== VISA ====================
exports.addVisa = async (req, res, next) => {
  try {
    const visa = await Visa.create(req.body);
    res.status(201).json({ success: true, message: 'Visa added', visa });
  } catch (error) {
    next(error);
  }
};

exports.updateVisa = async (req, res, next) => {
  try {
    const visa = await Visa.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!visa) return res.status(404).json({ success: false, message: 'Visa not found' });
    res.json({ success: true, visa });
  } catch (error) {
    next(error);
  }
};

exports.approveVisaApplication = async (req, res, next) => {
  try {
    const app = await VisaApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status || 'approved', reviewedAt: new Date(), reviewedBy: req.user.id, adminNotes: req.body.adminNotes },
      { new: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application: app });
  } catch (error) {
    next(error);
  }
};

// ==================== BOOKINGS ====================
exports.getAllBookings = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let bookings = [];
    let total = 0;

    if (type === 'bus') {
      bookings = await BusBooking.find(query).populate('bus').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
      total = await BusBooking.countDocuments(query);
    } else if (type === 'cab') {
      const cabQuery = status ? { bookingStatus: status } : {};
      bookings = await CabBooking.find(cabQuery).populate('cab').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
      total = await CabBooking.countDocuments(cabQuery);
    } else if (type === 'cruise') {
      bookings = await CruiseBooking.find(query).populate('cruise').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
      total = await CruiseBooking.countDocuments(query);
    } else {
      const bQuery = { ...query };
      if (type && type !== 'all') bQuery.bookingType = type;
      bookings = await Booking.find(bQuery)
        .populate('user', 'name email')
        .populate('flight', 'airline from to')
        .populate('hotel', 'name city')
        .populate('package', 'title destination')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      total = await Booking.countDocuments(bQuery);
    }

    res.json({ success: true, bookings, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled', cancellationReason: req.body.reason }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// ==================== USERS ====================
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await User.countDocuments();
    res.json({ success: true, users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};
