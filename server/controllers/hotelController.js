/**
 * Hotel Controller
 * Search, details, room availability, booking
 */

const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Booking = require('../models/booking');

/**
 * @desc    Search hotels by city
 * @route   GET /api/hotels/search
 * @access  Public
 */
exports.searchHotels = async (req, res, next) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      minRating,
      starCategory,
      amenities,
      freeCancellation,
      propertyType,
      checkIn,
      checkOut,
      sort = 'rating',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    if (!city) {
      return res.status(400).json({ success: false, message: 'city is required' });
    }

    const query = { city: new RegExp(city, 'i'), isActive: true };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (starCategory) query.starCategory = parseInt(starCategory);
    if (amenities) {
      const amList = amenities.split(',').map(a => a.trim());
      query.amenities = { $all: amList };
    }
    if (freeCancellation === 'true' || freeCancellation === true) query.freeCancellation = true;
    if (propertyType) query.propertyType = new RegExp(propertyType, 'i');

    const sortObj = {};
    if (sort === 'rating') sortObj.rating = order === 'asc' ? 1 : -1;
    else if (sort === 'starCategory') sortObj.starCategory = order === 'asc' ? 1 : -1;
    else sortObj.rating = -1;

    // Fetch more when price filter/sort is used so we can filter/sort by room price
    const needPriceFilter = !!(minPrice || maxPrice || sort === 'price');
    const fetchLimit = needPriceFilter ? 500 : parseInt(limit);
    const fetchSkip = needPriceFilter ? 0 : (parseInt(page) - 1) * parseInt(limit);
    let hotels = await Hotel.find(query).sort(sortObj).skip(fetchSkip).limit(fetchLimit).lean();

    const hotelIds = hotels.map(h => h._id);
    const roomPrices = await Room.aggregate([
      { $match: { hotel: { $in: hotelIds }, isActive: true } },
      { $group: { _id: '$hotel', minPrice: { $min: '$pricePerNight' } } },
    ]);
    const priceMap = {};
    roomPrices.forEach(r => { priceMap[r._id.toString()] = r.minPrice; });
    hotels = hotels.map(h => ({ ...h, pricePerNight: priceMap[h._id.toString()] ?? 0 }));

    if (minPrice || maxPrice) {
      hotels = hotels.filter(h => {
        const p = h.pricePerNight || 0;
        if (minPrice && p < parseInt(minPrice)) return false;
        if (maxPrice && p > parseInt(maxPrice)) return false;
        return true;
      });
    }

    if (sort === 'price') {
      hotels.sort((a, b) => (order === 'asc' ? (a.pricePerNight - b.pricePerNight) : (b.pricePerNight - a.pricePerNight)));
    }

    let total;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    if (needPriceFilter) {
      total = hotels.length;
      hotels = hotels.slice(skip, skip + parseInt(limit));
    } else {
      total = await Hotel.countDocuments(query);
    }

    res.json({
      success: true,
      hotels,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured hotels (top-rated across cities)
 * @route   GET /api/hotels/featured
 * @access  Public
 */
exports.getFeaturedHotels = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;
    const hotels = await Hotel.find({ isActive: true })
      .sort({ rating: -1, starCategory: -1 })
      .limit(parseInt(limit))
      .lean();

    const hotelIds = hotels.map(h => h._id);
    const roomPrices = await Room.aggregate([
      { $match: { hotel: { $in: hotelIds }, isActive: true } },
      { $group: { _id: '$hotel', minPrice: { $min: '$pricePerNight' } } },
    ]);
    const priceMap = {};
    roomPrices.forEach(r => { priceMap[r._id.toString()] = r.minPrice; });
    const result = hotels.map(h => ({ ...h, pricePerNight: priceMap[h._id.toString()] ?? 0 }));

    res.json({ success: true, hotels: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get popular hotel destinations (cities with count and min price)
 * @route   GET /api/hotels/destinations
 * @access  Public
 */
exports.getPopularDestinations = async (req, res, next) => {
  try {
    const cityCounts = await Hotel.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 24 },
    ]);
    const cityMinPrices = await Room.aggregate([
      { $lookup: { from: 'hotels', localField: 'hotel', foreignField: '_id', as: 'h' } },
      { $unwind: '$h' },
      { $match: { 'h.isActive': true, isActive: true } },
      { $group: { _id: '$h.city', minPrice: { $min: '$pricePerNight' } } },
    ]);
    const priceMap = {};
    cityMinPrices.forEach(p => { priceMap[p._id] = p.minPrice; });
    const destinations = cityCounts.map(c => ({
      city: c._id,
      count: c.count,
      minPrice: priceMap[c._id] || 1999,
    }));

    res.json({ success: true, destinations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all hotels
 * @route   GET /api/hotels
 * @access  Public
 */
exports.getAllHotels = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const hotels = await Hotel.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await Hotel.countDocuments({ isActive: true });
    res.json({
      success: true,
      hotels,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get hotel by ID
 * @route   GET /api/hotels/:id
 * @access  Public
 */
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    const rooms = await Room.find({ hotel: hotel._id, isActive: true }).lean();
    res.json({ success: true, hotel: { ...hotel.toObject(), rooms } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get room availability for dates
 * @route   GET /api/hotels/:hotelId/rooms/availability
 * @access  Public
 */
exports.getRoomAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'checkIn and checkOut dates required' });
    }

    const cIn = new Date(checkIn);
    const cOut = new Date(checkOut);
    if (cOut <= cIn) {
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in' });
    }

    const rooms = await Room.find({ hotel: req.params.hotelId, isActive: true }).lean();

    const bookedRooms = await Booking.aggregate([
      {
        $match: {
          bookingType: 'hotel',
          hotel: new mongoose.Types.ObjectId(req.params.hotelId),
          status: { $nin: ['cancelled'] },
          $or: [
            { checkIn: { $lt: cOut }, checkOut: { $gt: cIn } },
          ],
        },
      },
      { $group: { _id: '$room', count: { $sum: '$rooms' } } },
    ]);

    const bookedMap = {};
    bookedRooms.forEach(b => { bookedMap[b._id.toString()] = b.count; });

    const availableRooms = rooms.map(r => {
      const booked = bookedMap[r._id.toString()] || 0;
      const available = Math.max(0, (r.availableRooms || r.totalRooms) - booked);
      const nights = Math.ceil((cOut - cIn) / (1000 * 60 * 60 * 24));
      const totalPrice = r.pricePerNight * nights * 1; // 1 room
      return {
        ...r,
        available,
        nights,
        totalPrice,
        pricePerNight: r.pricePerNight,
      };
    });

    res.json({
      success: true,
      checkIn,
      checkOut,
      rooms: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};
