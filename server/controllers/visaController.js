/**
 * Visa Controller
 * Visa types, country listing, application submission
 */

const Visa = require('../models/visa');
const VisaApplication = require('../models/visaApplication');

/**
 * @desc    Get visas by country and/or type
 * @route   GET /api/visa
 * @access  Public
 */
exports.getVisas = async (req, res, next) => {
  try {
    const { country, visaType, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (country) query.country = new RegExp(country, 'i');
    if (visaType) query.visaType = visaType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const visas = await Visa.find(query).sort({ country: 1, price: 1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await Visa.countDocuments(query);

    res.json({
      success: true,
      visas,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get visa by ID
 * @route   GET /api/visa/:id
 * @access  Public
 */
exports.getVisaById = async (req, res, next) => {
  try {
    const visa = await Visa.findById(req.params.id);
    if (!visa) {
      return res.status(404).json({ success: false, message: 'Visa not found' });
    }
    res.json({ success: true, visa });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of countries with visas
 * @route   GET /api/visa/countries
 * @access  Public
 */
exports.getCountries = async (req, res, next) => {
  try {
    const countries = await Visa.distinct('country', { isActive: true });
    res.json({ success: true, countries: countries.sort() });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit visa application
 * @route   POST /api/visa/:id/apply
 * @access  Private
 */
exports.submitApplication = async (req, res, next) => {
  try {
    const visa = await Visa.findById(req.params.id);
    if (!visa) {
      return res.status(404).json({ success: false, message: 'Visa not found' });
    }

    const { fullName, email, phone, passportNumber, nationality, travelDate, purpose, documents } = req.body;

    const application = await VisaApplication.create({
      user: req.user.id,
      visa: visa._id,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      passportNumber,
      nationality,
      travelDate: travelDate ? new Date(travelDate) : undefined,
      purpose,
      documents: documents || [],
    });

    res.status(201).json({
      success: true,
      message: 'Visa application submitted',
      application: { id: application._id, status: application.status },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's visa applications
 * @route   GET /api/visa/my-applications
 * @access  Private
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await VisaApplication.find({ user: req.user.id })
      .populate('visa', 'country visaType name price')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};
