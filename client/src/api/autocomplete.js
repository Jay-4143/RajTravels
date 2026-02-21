import api from './axios';

/**
 * Search airports & cities by keyword (Amadeus-powered)
 * @param {string} keyword - partial search text (e.g. "Del", "New", "JFK")
 * @returns {Promise} - { success, locations: [{ iataCode, name, cityName, countryCode, subType, label }] }
 */
export const searchLocations = (keyword) =>
    api.get('/autocomplete/locations', { params: { keyword } });
