/**
 * Autocomplete Controller
 * Location search (airports & cities) via Amadeus
 */

const amadeusService = require('../services/amadeusService');
const { transformLocations } = require('../utils/amadeusTransformers');

/**
 * @desc    Search airports & cities by keyword
 * @route   GET /api/autocomplete/locations
 * @access  Public
 */
exports.searchLocations = async (req, res, next) => {
    try {
        const { keyword, subType = 'AIRPORT,CITY' } = req.query;

        if (!keyword || keyword.length < 2) {
            return res.json({ success: true, locations: [] });
        }

        const response = await amadeusService.searchLocations(keyword, subType);
        const locations = transformLocations(response.data || []);

        res.json({ success: true, locations });
    } catch (error) {
        console.error('Amadeus Location Search Error:', error.description || error.message);

        // Return common Indian cities/airports as fallback
        const fallback = getFallbackLocations(req.query.keyword || '');
        res.json({ success: true, locations: fallback, source: 'fallback' });
    }
};

/**
 * Hardcoded fallback for when Amadeus is down or rate-limited
 */
function getFallbackLocations(keyword) {
    const all = [
        { iataCode: 'DEL', name: 'Indira Gandhi Intl', cityName: 'New Delhi', countryCode: 'IN', subType: 'AIRPORT', label: 'Indira Gandhi Intl (DEL) – New Delhi' },
        { iataCode: 'BOM', name: 'Chhatrapati Shivaji Intl', cityName: 'Mumbai', countryCode: 'IN', subType: 'AIRPORT', label: 'Chhatrapati Shivaji Intl (BOM) – Mumbai' },
        { iataCode: 'BLR', name: 'Kempegowda Intl', cityName: 'Bangalore', countryCode: 'IN', subType: 'AIRPORT', label: 'Kempegowda Intl (BLR) – Bangalore' },
        { iataCode: 'MAA', name: 'Chennai Intl', cityName: 'Chennai', countryCode: 'IN', subType: 'AIRPORT', label: 'Chennai Intl (MAA) – Chennai' },
        { iataCode: 'CCU', name: 'Netaji Subhas Chandra Bose Intl', cityName: 'Kolkata', countryCode: 'IN', subType: 'AIRPORT', label: 'Netaji Subhas Chandra Bose Intl (CCU) – Kolkata' },
        { iataCode: 'HYD', name: 'Rajiv Gandhi Intl', cityName: 'Hyderabad', countryCode: 'IN', subType: 'AIRPORT', label: 'Rajiv Gandhi Intl (HYD) – Hyderabad' },
        { iataCode: 'GOI', name: 'Dabolim Airport', cityName: 'Goa', countryCode: 'IN', subType: 'AIRPORT', label: 'Dabolim Airport (GOI) – Goa' },
        { iataCode: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', cityName: 'Ahmedabad', countryCode: 'IN', subType: 'AIRPORT', label: 'Sardar Vallabhbhai Patel Intl (AMD) – Ahmedabad' },
        { iataCode: 'PNQ', name: 'Pune Airport', cityName: 'Pune', countryCode: 'IN', subType: 'AIRPORT', label: 'Pune Airport (PNQ) – Pune' },
        { iataCode: 'JAI', name: 'Jaipur Intl', cityName: 'Jaipur', countryCode: 'IN', subType: 'AIRPORT', label: 'Jaipur Intl (JAI) – Jaipur' },
        { iataCode: 'COK', name: 'Cochin Intl', cityName: 'Kochi', countryCode: 'IN', subType: 'AIRPORT', label: 'Cochin Intl (COK) – Kochi' },
        { iataCode: 'DXB', name: 'Dubai Intl', cityName: 'Dubai', countryCode: 'AE', subType: 'AIRPORT', label: 'Dubai Intl (DXB) – Dubai' },
        { iataCode: 'SIN', name: 'Changi Airport', cityName: 'Singapore', countryCode: 'SG', subType: 'AIRPORT', label: 'Changi Airport (SIN) – Singapore' },
        { iataCode: 'LHR', name: 'Heathrow', cityName: 'London', countryCode: 'GB', subType: 'AIRPORT', label: 'Heathrow (LHR) – London' },
        { iataCode: 'JFK', name: 'John F Kennedy Intl', cityName: 'New York', countryCode: 'US', subType: 'AIRPORT', label: 'John F Kennedy Intl (JFK) – New York' },
        { iataCode: 'LAX', name: 'Los Angeles Intl', cityName: 'Los Angeles', countryCode: 'US', subType: 'AIRPORT', label: 'Los Angeles Intl (LAX) – Los Angeles' },
        { iataCode: 'CDG', name: 'Charles de Gaulle', cityName: 'Paris', countryCode: 'FR', subType: 'AIRPORT', label: 'Charles de Gaulle (CDG) – Paris' },
        { iataCode: 'BKK', name: 'Suvarnabhumi', cityName: 'Bangkok', countryCode: 'TH', subType: 'AIRPORT', label: 'Suvarnabhumi (BKK) – Bangkok' },
    ];
    const kw = keyword.toLowerCase();
    return all.filter(l =>
        l.iataCode.toLowerCase().includes(kw) ||
        l.name.toLowerCase().includes(kw) ||
        l.cityName.toLowerCase().includes(kw)
    );
}
