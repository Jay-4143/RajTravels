import React from 'react';
import { FaGlobeAmericas, FaHistory, FaBuilding, FaHeadset, FaShippingFast, FaUserShield } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-gray-100">
        <div className="text-4xl text-blue-600 mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const VisaFeatures = () => {
    const features = [
        {
            icon: <FaGlobeAmericas />,
            title: "180+ Countries",
            description: "Visa services for practically every destination worldwide."
        },
        {
            icon: <FaHistory />,
            title: "45+ Years Expertise",
            description: "Decades of experience in handling complex visa scenarios."
        },
        {
            icon: <FaBuilding />,
            title: "150+ Branches",
            description: "Global presence to assist you wherever you are."
        },
        {
            icon: <FaHeadset />,
            title: "Support from Start to Stamp",
            description: "Dedicated team guiding you through every step."
        },
        {
            icon: <FaShippingFast />,
            title: "Doorstep Convenience",
            description: "Document pickup and drop services available."
        },
        {
            icon: <FaUserShield />,
            title: "Safety & Confidentiality",
            description: "Your documents and data are handled with utmost security."
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Applying for a Visa is Simple</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Experience a hassle-free visa application process with our expert guidance and support.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VisaFeatures;
