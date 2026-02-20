import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
            <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-gray-800">{question}</span>
                <span className="text-gray-500">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </button>
            {isOpen && (
                <div className="p-4 bg-white text-gray-600 border-t border-gray-100">
                    {answer}
                </div>
            )}
        </div>
    );
};

const VisaFAQ = () => {
    const faqs = [
        {
            question: "Do I need a visa for every country?",
            answer: "Visa requirements depend on your nationality and the destination country. Use our search tool above to check specific requirements for your trip."
        },
        {
            question: "How long does it take to process a visa?",
            answer: "Processing times vary by country and visa type. It can range from 24 hours for e-visas to several weeks for embassy visas. Specific times are listed for each visa option."
        },
        {
            question: "What documents are generally required?",
            answer: "Common documents include a valid passport (min. 6 months validity), passport-sized photos, flight itinerary, and hotel booking. Some visas may require financial proof or employment letters."
        },
        {
            question: "Can I track my visa application status?",
            answer: "Yes, once you submit your application with us, our team will keep you updated at every stage of the process via email and SMS."
        },
        {
            question: "Is the visa fee refundable if my application is rejected?",
            answer: "Visa fees are generally non-refundable as they are charged by the respective embassies or immigration authorities for processing the application, regardless of the outcome."
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VisaFAQ;
