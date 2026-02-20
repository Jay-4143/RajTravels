import React, { useState, useEffect } from 'react';
import { getVisaOptions, searchVisas } from '../../api/visaApi';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlaneDeparture, FaPassport } from 'react-icons/fa';

const VisaHero = ({ setSearchResults, setLoading }) => {
    const navigate = useNavigate();
    const [options, setOptions] = useState({ countries: [], visaTypes: [], nationalities: [] });
    const [formData, setFormData] = useState({
        country: '',
        nationality: 'Indian', // Default
        visaType: ''
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await getVisaOptions();
                if (response.success) {
                    setOptions(response.data);
                }
            } catch (error) {
                console.error("Failed to load visa options", error);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const results = await searchVisas(formData);
            setSearchResults(results.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}>

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Choose Destination. We'll Handle the Visa
                </h1>
                <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
                    Get your visa processed quickly and securely with our expert assistance. 99% approval rate.
                </p>

                {/* Search Form Container */}
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                        {/* Travelling To */}
                        <div className="text-left">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                <FaPlaneDeparture className="inline mr-1" /> Travelling to
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Select Destination</option>
                                {options.countries.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Citizen Of */}
                        <div className="text-left">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                <FaPassport className="inline mr-1" /> I am a citizen of
                            </label>
                            <select
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {options.nationalities.map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                                <option value="All">Other</option>
                            </select>
                        </div>

                        {/* Visa Type */}
                        <div className="text-left">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Visa Type
                            </label>
                            <select
                                name="visaType"
                                value={formData.visaType}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Any Type</option>
                                {options.visaTypes.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
                            >
                                <FaSearch /> Search Visa
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default VisaHero;
