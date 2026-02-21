import axios from './axios';

export const searchCruises = (params) => axios.get('/cruises', { params });
export const getCruiseDetails = (id) => axios.get(`/cruises/${id}`);
export const createCruiseBooking = (data) => axios.post('/cruises/book', data);
export const getMyCruiseBookings = () => axios.get('/cruises/my/bookings');
