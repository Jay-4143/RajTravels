/**
 * Amadeus Service
 * Central SDK initialisation + helper wrappers
 */

const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    // hostname: 'production'   // uncomment for pay-as-you-go production
});

/* ──────────────── FLIGHTS ──────────────── */

/**
 * Search flight offers
 * @param {Object} params
 * @param {string} params.origin        IATA code (e.g. "JFK")
 * @param {string} params.destination   IATA code (e.g. "LAX")
 * @param {string} params.departureDate YYYY-MM-DD
 * @param {string} [params.returnDate]  YYYY-MM-DD (for round-trip)
 * @param {number} [params.adults=1]
 * @param {string} [params.travelClass] ECONOMY | PREMIUM_ECONOMY | BUSINESS | FIRST
 * @param {number} [params.maxStops]    0 for non-stop only
 * @param {number} [params.max=50]      max results to return
 */
exports.searchFlightOffers = async ({
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    travelClass,
    maxStops,
    max = 50,
}) => {
    const query = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        adults: String(adults),
        max: String(max),
        currencyCode: 'INR',
    };
    if (returnDate) query.returnDate = returnDate;
    if (travelClass) query.travelClass = travelClass;
    if (maxStops !== undefined && maxStops !== null) query.nonStop = maxStops === 0 ? 'true' : 'false';

    const response = await amadeus.shopping.flightOffersSearch.get(query);
    return response;
};

/**
 * Search multi-city flight offers (using POST for complex itineraries)
 * @param {Object} params
 * @param {Array} params.segments [{ from, to, date }]
 * @param {number} [params.adults=1]
 * @param {string} [params.travelClass]
 */
exports.searchMultiCityFlightOffers = async ({ segments, adults = 1, travelClass }) => {
    const body = {
        currencyCode: 'INR',
        originDestinations: segments.map((s, i) => ({
            id: String(i + 1),
            originLocationCode: s.from.toUpperCase(),
            destinationLocationCode: s.to.toUpperCase(),
            departureDateTimeRange: { date: s.date },
        })),
        travelers: Array.from({ length: adults }, (_, i) => ({
            id: String(i + 1),
            travelerType: 'ADULT',
        })),
        sources: ['GDS'],
        searchCriteria: {
            maxFlightOffers: 50,
            flightFilters: {
                cabinRestrictions: travelClass ? [{
                    cabin: travelClass,
                    coverage: 'MOST_SEGMENTS',
                    originDestinationIds: segments.map((_, i) => String(i + 1)),
                }] : undefined,
            },
        },
    };

    const response = await amadeus.shopping.flightOffersSearch.post(JSON.stringify(body));
    return response;
};

/**
 * Price a specific flight offer (confirm price + tax breakdown)
 */
exports.priceFlightOffer = async (flightOffer) => {
    const response = await amadeus.shopping.flightOffers.pricing.post({
        data: {
            type: 'flight-offers-pricing',
            flightOffers: [flightOffer],
        },
    });
    return response;
};

/* ──────────────── HOTELS ──────────────── */

/**
 * Get list of hotel IDs for a city
 * @param {string} cityCode IATA city code (e.g. "PAR")
 */
exports.searchHotelsByCity = async (cityCode) => {
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
        cityCode,
    });
    return response;
};

/**
 * Get hotel offers (availability + pricing)
 * @param {Object} params
 * @param {string} params.hotelIds   comma-separated Amadeus hotel IDs
 * @param {number} [params.adults=1]
 * @param {string} [params.checkInDate]
 * @param {string} [params.checkOutDate]
 */
exports.getHotelOffers = async ({ hotelIds, adults = 1, checkInDate, checkOutDate }) => {
    const query = {
        hotelIds,
        adults: String(adults),
        currencyCode: 'INR',
    };
    if (checkInDate) query.checkInDate = checkInDate;
    if (checkOutDate) query.checkOutDate = checkOutDate;

    const response = await amadeus.shopping.hotelOffersSearch.get(query);
    return response;
};

/* ──────────────── LOCATIONS / AUTOCOMPLETE ──────────────── */

/**
 * Search airports & cities by keyword
 * @param {string} keyword  partial text (e.g. "LON", "New")
 * @param {string} [subType='AIRPORT,CITY']
 */
exports.searchLocations = async (keyword, subType = 'AIRPORT,CITY') => {
    const response = await amadeus.referenceData.locations.get({
        keyword,
        subType,
    });
    return response;
};
