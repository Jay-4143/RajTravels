import axios from './axios';

// Search buses
export const searchBuses = async (params) => {
    const response = await axios.get('/buses/search', { params });
    return response.data;
};

// Get available cities
export const getCities = async () => {
    const response = await axios.get('/buses/cities');
    return response.data;
};

// Get bus by ID (with seat map)
export const getBusById = async (id) => {
    const response = await axios.get(`/buses/${id}`);
    return response.data;
};

// Book a bus
export const bookBus = async (data) => {
    const response = await axios.post('/buses/book', data);
    return response.data;
};

// Get my bookings
export const getMyBusBookings = async () => {
    const response = await axios.get('/buses/my-bookings');
    return response.data;
};

// Cancel a booking
export const cancelBusBooking = async (bookingId) => {
    const response = await axios.put(`/buses/bookings/${bookingId}/cancel`);
    return response.data;
};
