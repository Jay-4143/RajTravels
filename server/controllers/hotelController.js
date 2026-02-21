/**
 * Hotel Controller
 * Search, details, room availability, booking
 * searchHotels now powered by Amadeus API with MongoDB fallback
 */

const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Booking = require('../models/booking');
const amadeusService = require('../services/amadeusService');
const { transformHotelOffers } = require('../utils/amadeusTransformers');

/**
 * @desc    Search hotels by city (Amadeus API → fallback to MongoDB)
 * @route   GET /api/hotels/search
 * @access  Public
 */
exports.searchHotels = async (req, res, next) => {
  try {
    const {
      city,
      cityCode,
      checkIn,
      checkOut,
      guests = 1,
      minPrice,
      maxPrice,
      minRating,
      starCategory, // backward compatibility
      stars: starsQuery, // from frontend checkbox array
      amenities,
      propertyType,
      chainName,
      sort = 'rating',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    if (!city && !cityCode) {
      return res.status(400).json({ success: false, message: 'city or cityCode is required' });
    }

    // Determine IATA city code
    const code = cityCode || city?.toUpperCase();

    try {
      // Step 1: Get hotel IDs for the city
      const hotelListResp = await amadeusService.searchHotelsByCity(code);
      const hotelIds = (hotelListResp.data || [])
        .slice(0, 20) // Limit to first 20 hotels to stay within API limits
        .map(h => h.hotelId)
        .filter(Boolean);

      if (hotelIds.length === 0) {
        throw new Error('No hotels found for this city in Amadeus');
      }

      // Step 2: Get offers for those hotels
      const offersResp = await amadeusService.getHotelOffers({
        hotelIds: hotelIds.join(','),
        adults: parseInt(guests) || 1,
        checkInDate: checkIn || undefined,
        checkOutDate: checkOut || undefined,
      });

      let hotels = transformHotelOffers(offersResp.data || []);

      // ── Client-side filters ──
      if (minPrice || maxPrice) {
        hotels = hotels.filter(h => {
          const p = h.pricePerNight || 0;
          if (minPrice && p < parseInt(minPrice)) return false;
          if (maxPrice && p > parseInt(maxPrice)) return false;
          return true;
        });
      }
      if (minRating) hotels = hotels.filter(h => h.rating >= parseFloat(minRating));

      const starList = starsQuery
        ? (typeof starsQuery === 'string' ? starsQuery.split(',').map(Number) : starsQuery)
        : (starCategory ? [parseInt(starCategory)] : null);

      if (starList && starList.length > 0) {
        hotels = hotels.filter(h => starList.includes(Math.round(h.starCategory || 0)));
      }

      if (amenities) {
        const amList = amenities.split(',').map(a => a.trim().toLowerCase());
        hotels = hotels.filter(h =>
          amList.every(am => h.amenities?.some(a => a.toLowerCase().includes(am)))
        );
      }

      if (propertyType) {
        const ptList = propertyType.split(',').map(p => p.trim().toLowerCase());
        hotels = hotels.filter(h => ptList.includes(h.propertyType?.toLowerCase()));
      }

      if (chainName) {
        const chainList = chainName.split(',').map(c => c.trim().toLowerCase());
        hotels = hotels.filter(h => chainList.includes(h.chainName?.toLowerCase()));
      }

      // ── Sorting ──
      if (sort === 'price') {
        hotels.sort((a, b) => order === 'asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight);
      } else if (sort === 'rating') {
        hotels.sort((a, b) => order === 'asc' ? a.rating - b.rating : b.rating - a.rating);
      } else if (sort === 'starCategory') {
        hotels.sort((a, b) => order === 'asc' ? a.starCategory - b.starCategory : b.starCategory - a.starCategory);
      }

      // ── Pagination ──
      const total = hotels.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paged = hotels.slice(skip, skip + parseInt(limit));

      return res.json({
        success: true,
        hotels: paged,
        source: 'amadeus',
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      });
    } catch (amadeusErr) {
      console.error('Amadeus Hotel Search Error:', amadeusErr.description || amadeusErr.message);
      console.log('Falling back to local MongoDB hotel search...');
      // Fall through to MongoDB fallback below
    }

    // ── MongoDB Fallback ──
    return exports._localSearchHotels(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * MongoDB fallback for hotel search
 */
exports._localSearchHotels = async (req, res, next) => {
  try {
    const {
      city, minPrice, maxPrice, minRating, starCategory,
      stars: starsQuery, amenities, freeCancellation, propertyType, chainName,
      sort = 'rating', order = 'desc', page = 1, limit = 20,
    } = req.query;

    const query = { city: new RegExp(city || '', 'i'), isActive: true };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (starCategory) query.starCategory = parseInt(starCategory);
    if (amenities) {
      const amList = amenities.split(',').map(a => a.trim());
      query.amenities = { $all: amList };
    }
    if (freeCancellation === 'true') query.freeCancellation = true;

    if (starsQuery) {
      const starList = starsQuery.split(',').map(Number);
      query.starCategory = { $in: starList };
    }

    if (propertyType) {
      const ptList = propertyType.split(',').map(p => p.trim());
      query.propertyType = { $in: ptList.map(pt => new RegExp(pt, 'i')) };
    }

    if (chainName) {
      const chainList = chainName.split(',').map(c => c.trim());
      query.chainName = { $in: chainList.map(cn => new RegExp(cn, 'i')) };
    }

    const sortObj = {};
    if (sort === 'rating') sortObj.rating = order === 'asc' ? 1 : -1;
    else if (sort === 'starCategory') sortObj.starCategory = order === 'asc' ? 1 : -1;
    else sortObj.rating = -1;

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
      hotels.sort((a, b) => order === 'asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight);
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
      source: 'mongodb',
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
 * @desc    Get popular hotel destinations
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
          $or: [{ checkIn: { $lt: cOut }, checkOut: { $gt: cIn } }],
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
      const totalPrice = r.pricePerNight * nights * 1;
      return { ...r, available, nights, totalPrice, pricePerNight: r.pricePerNight };
    });

    res.json({ success: true, checkIn, checkOut, rooms: availableRooms });
  } catch (error) {
    next(error);
  }
};
