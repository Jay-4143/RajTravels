import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVisaById, submitVisaInquiry } from "../api/visaApi";

const VisaApplication = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [visa, setVisa] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        travelDate: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getVisaById(id)
            .then((res) => {
                if (res.success) {
                    setVisa(res.data);
                } else {
                    setError("Failed to load visa details");
                }
            })
            .catch((err) => setError("Failed to load visa details"));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await submitVisaInquiry({
                visaId: id,
                ...formData
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!visa && !error) return <div className="text-center py-12">Loading...</div>;
    if (error && !visa) return <div className="text-center py-12 text-red-600">{error}</div>;

    if (submitted) {
        return (
            <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
                    <p className="text-gray-600 mb-6">
                        We have received your inquiry for a {visa?.country} visa. Our team will contact you shortly at {formData.email}.
                    </p>
                    <button
                        onClick={() => navigate("/visa")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Back to Visa Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            <div className="max-w-2xl mx-auto px-4">
                <button onClick={() => navigate(`/visa/${id}`)} className="text-blue-600 mb-6 hover:underline">
                    &larr; Back to Visa Details
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gray-900 text-white p-6">
                        <h1 className="text-2xl font-bold">Apply for {visa?.country} Visa</h1>
                        <p className="text-gray-300 text-sm mt-1">{visa?.visaType} • ₹{visa?.cost}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Intended Travel Date</label>
                            <input
                                type="date"
                                name="travelDate"
                                required
                                value={formData.travelDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                            <textarea
                                name="notes"
                                rows="3"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-50"
                            >
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VisaApplication;
