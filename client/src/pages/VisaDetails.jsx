import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVisaById } from "../api/visaApi";

const VisaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [visa, setVisa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getVisaById(id)
            .then((res) => {
                // API returns { success: true, data: visa }
                // getVisaById returns response.data which is { success: true, data: visa }
                if (res.success) {
                    setVisa(res.data);
                } else {
                    setError("Failed to load visa details");
                }
            })
            .catch((err) => setError(err.response?.data?.message || "Failed to load visa details"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
    if (!visa) return <div className="text-center py-12">Visa not found</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <button onClick={() => navigate("/visa")} className="text-blue-600 mb-6 hover:underline">
                    &larr; Back to Visa Search
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-blue-600 text-white p-6">
                        <h1 className="text-3xl font-bold">{visa.country} Visa</h1>
                        <p className="opacity-90 mt-1">{visa.visaType} &bull; {visa.entryType}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Key Details</h3>
                                <ul className="space-y-3">
                                    <li className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Processing Time</span>
                                        <span className="font-medium">{visa.processingTime}</span>
                                    </li>
                                    <li className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-medium">{visa.duration}</span>
                                    </li>
                                    <li className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Validity</span>
                                        <span className="font-medium">{visa.validity}</span>
                                    </li>
                                    <li className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Total Cost</span>
                                        <span className="font-medium text-blue-600">₹{visa.cost}</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Documents Required</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {visa.documentsRequired?.map((doc, idx) => (
                                        <li key={idx}>{doc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {visa.description && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{visa.description}</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t">
                            <button
                                onClick={() => navigate(`/visa/${id}/apply`)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisaDetails;
