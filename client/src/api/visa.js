import api from './axios';

export const getVisaCountries = () => api.get('/visa/countries');
export const getVisaOptions = () => api.get('/visa/options');
export const searchVisa = (payload) => api.post('/visa/search', payload);
export const applyVisa = (payload) => api.post('/visa/apply', payload);
export const getVisaById = (id) => api.get(`/visa/${id}`);

