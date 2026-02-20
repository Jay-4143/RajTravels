import axios from './axios';

// Get dropdown options (countries, visa types)
export const getVisaOptions = async () => {
    const response = await axios.get('/visa/options');
    return response.data;
};

// Search visas
export const searchVisas = async (searchData) => {
    const response = await axios.post('/visa/search', searchData);
    return response.data;
};

// Get single visa details
export const getVisaById = async (id) => {
    const response = await axios.get(`/visa/${id}`);
    return response.data;
};

// Submit inquiry
export const submitVisaInquiry = async (inquiryData) => {
    const response = await axios.post('/visa/apply', inquiryData);
    return response.data;
};
