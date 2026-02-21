/**
 * Amadeus Response Transformers
 * Convert raw Amadeus API responses into the shape the frontend expects
 */

/* ──────────── Airline dictionary lookup ──────────── */
const AIRLINE_NAMES = {
    '6E': 'IndiGo', 'AI': 'Air India', 'SG': 'SpiceJet', 'UK': 'Vistara',
    'AA': 'American Airlines', 'UA': 'United Airlines', 'DL': 'Delta Air Lines',
    'BA': 'British Airways', 'EK': 'Emirates', 'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines', 'LH': 'Lufthansa', 'AF': 'Air France',
    'TK': 'Turkish Airlines', 'EY': 'Etihad Airways', 'QF': 'Qantas',
    'CX': 'Cathay Pacific', 'NH': 'ANA', 'JL': 'Japan Airlines',
    'KL': 'KLM', 'LX': 'Swiss', 'OS': 'Austrian', 'AZ': 'ITA Airways',
    'IB': 'Iberia', 'FR': 'Ryanair', 'U2': 'easyJet', 'WN': 'Southwest',
    'AC': 'Air Canada', 'NZ': 'Air New Zealand', 'VA': 'Virgin Australia',
    'VS': 'Virgin Atlantic', 'FZ': 'flydubai', 'WY': 'Oman Air',
    'GF': 'Gulf Air', 'MS': 'EgyptAir', 'ET': 'Ethiopian Airlines',
    'SA': 'South African Airways', 'KE': 'Korean Air', 'OZ': 'Asiana',
    'CI': 'China Airlines', 'BR': 'EVA Air', 'MH': 'Malaysia Airlines',
    'GA': 'Garuda Indonesia', 'TG': 'Thai Airways', '9W': 'Jet Airways',
    'G8': 'Go First', 'I5': 'AirAsia India', 'QP': 'Akasa Air',
};

/**
 * Parse ISO 8601 duration (PT2H30M) → "2h 30m"
 */
function parseDuration(iso) {
    if (!iso) return '—';
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return iso;
    const h = match[1] || '0';
    const m = match[2] || '0';
    return `${h}h ${m}m`;
}

/**
 * Map Amadeus travelClass string to our local class enum
 */
function mapClass(cls) {
    const map = {
        ECONOMY: 'economy',
        PREMIUM_ECONOMY: 'premium_economy',
        BUSINESS: 'business',
        FIRST: 'first',
    };
    return map[cls] || 'economy';
}

/**
 * Transform a single Amadeus flight offer into our frontend shape
 * @param {Object} offer       raw Amadeus flight offer object
 * @param {Object} dictionaries  the dictionaries object from the response (carriers, aircraft, etc.)
 * @returns {Object}
 */
exports.transformFlightOffer = (offer, dictionaries = {}) => {
    const carriers = dictionaries.carriers || {};

    // Take the first itinerary for outbound
    const outbound = offer.itineraries?.[0];
    const firstSeg = outbound?.segments?.[0];
    const lastSeg = outbound?.segments?.[outbound.segments.length - 1];
    const stops = (outbound?.segments?.length || 1) - 1;
    const stopCities = stops > 0
        ? outbound.segments.slice(0, -1).map(s => s.arrival?.iataCode).filter(Boolean)
        : [];

    const carrierCode = firstSeg?.carrierCode || '';
    const airlineName = carriers[carrierCode] || AIRLINE_NAMES[carrierCode] || carrierCode;

    const result = {
        _id: offer.id,
        source: 'amadeus',
        airline: airlineName,
        airlineCode: carrierCode,
        flightNumber: `${carrierCode}${firstSeg?.number || ''}`,
        from: firstSeg?.departure?.iataCode || '',
        to: lastSeg?.arrival?.iataCode || '',
        departureTime: firstSeg?.departure?.at || '',
        arrivalTime: lastSeg?.arrival?.at || '',
        duration: parseDuration(outbound?.duration),
        departureDate: firstSeg?.departure?.at?.split('T')[0] || '',
        price: parseFloat(offer.price?.total) || 0,
        currency: offer.price?.currency || 'INR',
        class: mapClass(offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin),
        seatsAvailable: offer.numberOfBookableSeats || 0,
        stops,
        stopCities,
        baggage: {
            cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight
                ? `${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight} ${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit || 'KG'}`
                : '7 kg',
            checkIn: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight
                ? `${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight} ${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit || 'KG'}`
                : '15 kg',
        },
        refundable: !offer.pricingOptions?.fareType?.includes('PUBLISHED') || false,
        isActive: true,
        // Keep raw offer for pricing confirmation later
        _raw: offer,
    };

    // Return flight (second itinerary for round-trip)
    if (offer.itineraries?.length > 1) {
        const returnIt = offer.itineraries[1];
        const retFirst = returnIt?.segments?.[0];
        const retLast = returnIt?.segments?.[returnIt.segments.length - 1];
        result.returnFlight = {
            airline: carriers[retFirst?.carrierCode] || AIRLINE_NAMES[retFirst?.carrierCode] || retFirst?.carrierCode || airlineName,
            flightNumber: `${retFirst?.carrierCode || carrierCode}${retFirst?.number || ''}`,
            from: retFirst?.departure?.iataCode || '',
            to: retLast?.arrival?.iataCode || '',
            departureTime: retFirst?.departure?.at || '',
            arrivalTime: retLast?.arrival?.at || '',
            duration: parseDuration(returnIt?.duration),
            stops: (returnIt?.segments?.length || 1) - 1,
        };
    }

    // Full segments for multi-city/complex itineraries
    result.itineraries = offer.itineraries.map(it => {
        const first = it.segments[0];
        const last = it.segments[it.segments.length - 1];
        return {
            from: first.departure.iataCode,
            to: last.arrival.iataCode,
            departureTime: first.departure.at,
            arrivalTime: last.arrival.at,
            duration: parseDuration(it.duration),
            stops: it.segments.length - 1,
            carrierCode: first.carrierCode,
            airline: carriers[first.carrierCode] || AIRLINE_NAMES[first.carrierCode] || first.carrierCode
        };
    });

    return result;
};

/**
 * Transform an array of Amadeus flight offers
 */
exports.transformFlightOffers = (data, dictionaries) => {
    if (!Array.isArray(data)) return [];
    return data.map(offer => exports.transformFlightOffer(offer, dictionaries));
};

/* ──────────── HOTELS ──────────── */

/**
 * Transform a single Amadeus hotel offer into our frontend shape
 */
exports.transformHotelOffer = (hotelData) => {
    const hotel = hotelData.hotel || hotelData;
    const offers = hotelData.offers || [];
    const firstOffer = offers[0] || {};
    const room = firstOffer.room || {};
    const price = firstOffer.price || {};

    return {
        _id: hotel.hotelId || hotel.dupeId || `amadeus-${Math.random().toString(36).slice(2)}`,
        source: 'amadeus',
        name: hotel.name || 'Unknown Hotel',
        city: hotel.cityCode || '',
        address: hotel.address ? `${hotel.address.lines?.join(', ') || ''}, ${hotel.address.cityName || ''}`.trim() : '',
        rating: hotel.rating ? parseFloat(hotel.rating) : 0,
        starCategory: hotel.rating ? parseInt(hotel.rating) : 3,
        amenities: hotel.amenities || [],
        images: hotel.media?.length
            ? hotel.media.map(m => m.uri)
            : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        location: {
            lat: hotel.latitude || 0,
            lng: hotel.longitude || 0,
        },
        description: hotel.description?.text || room.description?.text || '',
        pricePerNight: parseFloat(price.total) || 0,
        currency: price.currency || 'INR',
        freeCancellation: firstOffer.policies?.cancellation?.type === 'FULL_REFUNDABLE',
        isActive: true,
        // Attach rooms from all offers
        rooms: offers.map((o, idx) => ({
            _id: o.id || `room-${idx}`,
            name: o.room?.typeEstimated?.category || o.room?.type || 'Standard Room',
            roomType: o.room?.typeEstimated?.category || 'Standard',
            description: o.room?.description?.text || '',
            pricePerNight: parseFloat(o.price?.total) || 0,
            maxOccupancy: o.guests?.adults || 2,
            available: 1,
            amenities: [],
        })),
        _raw: hotelData,
    };
};

/**
 * Transform an array of Amadeus hotel results
 */
exports.transformHotelOffers = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(h => exports.transformHotelOffer(h));
};

/**
 * Transform location autocomplete results
 */
exports.transformLocations = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(loc => ({
        iataCode: loc.iataCode,
        name: loc.name,
        cityName: loc.address?.cityName || loc.name,
        countryCode: loc.address?.countryCode || '',
        subType: loc.subType, // 'AIRPORT' or 'CITY'
        label: `${loc.name} (${loc.iataCode})${loc.address?.cityName ? ` – ${loc.address.cityName}` : ''}`,
    }));
};
