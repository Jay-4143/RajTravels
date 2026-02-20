import React from 'react';
import { FaFileAlt, FaCreditCard, FaFileUpload, FaPassport } from 'react-icons/fa';

const StepCard = ({ number, icon, title, description }) => (
    <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl mb-4 shadow-lg border-4 border-white">
            {icon}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm w-full h-full border border-gray-100">
            <div className="text-sm font-bold text-blue-500 mb-2">STEP {number}</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

const VisaSteps = () => {
    const steps = [
        {
            number: "01",
            icon: <FaFileAlt />,
            title: "Fill Application",
            description: "Complete the simple online visa application form with your basic details."
        },
        {
            number: "02",
            icon: <FaFileUpload />,
            title: "Upload Documents",
            description: "Securely upload the required documents like passport scan and photos."
        },
        {
            number: "03",
            icon: <FaCreditCard />,
            title: "Pay Online",
            description: "Make a secure online payment using your preferred payment method."
        },
        {
            number: "04",
            icon: <FaPassport />,
            title: "Get Your Visa",
            description: "Receive your approved visa via email or collect it from our branch."
        }
    ];

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-gray-600">Get your visa in 4 easy steps</p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden lg:block absolute top-8 left-0 w-full h-1 bg-gray-200 -z-0"></div>

                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VisaSteps;
