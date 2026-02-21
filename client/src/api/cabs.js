import axios from './axios';

export const searchCabs = (params) => axios.get('/cabs', { params });
export const createCabBooking = (data) => axios.post('/cabs/book', data);
export const getMyCabBookings = () => axios.get('/cabs/my/bookings');
