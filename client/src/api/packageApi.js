import axios from './axios';

// Get all packages with optional filters
export const getPackages = async (params) => {
    const response = await axios.get('/packages', { params });
    return response.data;
};

// Get featured packages for homepage
export const getFeaturedPackages = async () => {
    const response = await axios.get('/packages/featured');
    return response.data;
};

// Get hot deal packages
export const getHotDeals = async () => {
    const response = await axios.get('/packages/hot-deals');
    return response.data;
};

// Get single package by ID
export const getPackageById = async (id) => {
    const response = await axios.get(`/packages/${id}`);
    return response.data;
};

// Submit package inquiry
export const submitPackageInquiry = async (id, data) => {
    const response = await axios.post(`/packages/${id}/inquiry`, data);
    return response.data;
};
