const Visa = require('../models/Visa');
const VisaInquiry = require('../models/VisaInquiry');

// @desc    Get all unique visa countries and types for dropdowns
// @route   GET /api/visa/options
// @access  Public
exports.getVisaOptions = async (req, res) => {
  try {
    const countries = await Visa.distinct('country');
    const visaTypes = await Visa.distinct('visaType');
    const nationalities = await Visa.distinct('nationality');

    res.status(200).json({
      success: true,
      data: {
        countries,
        visaTypes,
        nationalities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Search for visas based on criteria
// @route   POST /api/visa/search
// @access  Public
exports.searchVisas = async (req, res) => {
  try {
    const { country, nationality, visaType } = req.body;

    let query = {};

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (nationality) {
      // Logic: If specific nationality is requested, find visas for that nationality OR 'All'
      // This might need adjustment based on strict requirements, but 'All' is a safe default for generic visas
      query.nationality = { $in: [new RegExp(`^${nationality}$`, 'i'), 'All'] };
    }

    if (visaType) {
      query.visaType = { $regex: visaType, $options: 'i' };
    }

    const visas = await Visa.find(query).sort({ cost: 1 });

    res.status(200).json({
      success: true,
      count: visas.length,
      data: visas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all visas (with pagination)
// @route   GET /api/visa
// @access  Public
exports.getAllVisas = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visas = await Visa.find({ isActive: true })
      .sort({ country: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Visa.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: visas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single visa details
// @route   GET /api/visa/:id
// @access  Public
exports.getVisaById = async (req, res) => {
  try {
    const visa = await Visa.findById(req.params.id);

    if (!visa) {
      return res.status(404).json({
        success: false,
        message: 'Visa not found'
      });
    }

    res.status(200).json({
      success: true,
      data: visa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Submit a visa inquiry
// @route   POST /api/visa/inquiry
// @access  Public
exports.submitInquiry = async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      user: req.user?.id || req.user?._id
    };

    const inquiry = await VisaInquiry.create(inquiryData);

    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
