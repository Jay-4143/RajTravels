const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Visa = require('../models/Visa');
const connectDB = require('../config/db');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleVisas = [
    {
        country: 'United Arab Emirates',
        nationality: 'Indian',
        visaType: 'Tourist',
        processingTime: '3-4 Days',
        duration: '30 Days',
        entryType: 'Single Entry',
        validity: '58 Days',
        cost: 7500,
        currency: 'INR',
        documentsRequired: ['Passport', 'Photo'],
        description: 'Standard 30-day tourist visa for UAE.',
        images: ['https://images.unsplash.com/photo-1512453979798-5ea904ac6605?auto=format&fit=crop&q=80&w=1000']
    },
    {
        country: 'United Arab Emirates',
        nationality: 'Indian',
        visaType: 'Tourist',
        processingTime: '3-4 Days',
        duration: '60 Days',
        entryType: 'Single Entry',
        validity: '58 Days',
        cost: 14500,
        currency: 'INR',
        documentsRequired: ['Passport', 'Photo'],
        description: 'Longer duration 60-day tourist visa for UAE.',
        images: ['https://images.unsplash.com/photo-1512453979798-5ea904ac6605?auto=format&fit=crop&q=80&w=1000']
    },
    {
        country: 'Thailand',
        nationality: 'All',
        visaType: 'Tourist',
        processingTime: '3-4 Days',
        duration: '60 Days',
        entryType: 'Single Entry',
        validity: '90 Days',
        cost: 5500,
        currency: 'INR',
        documentsRequired: ['Passport', 'Photo', 'Flight Ticket'],
        description: 'Standard tourist visa for Thailand.',
        images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1000']
    },
    {
        country: 'Singapore',
        nationality: 'Indian',
        visaType: 'Tourist',
        processingTime: '5-6 Days',
        duration: '30 Days',
        entryType: 'Multiple Entry',
        validity: '2 Years',
        cost: 3500,
        currency: 'INR',
        documentsRequired: ['Passport', 'Photo', 'Form 14A'],
        description: 'Multiple entry tourist visa for Singapore.',
        images: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1000']
    },
    {
        country: 'Malaysia',
        nationality: 'Indian',
        visaType: 'Tourist',
        processingTime: '2-3 Days',
        duration: '30 Days',
        entryType: 'Single Entry',
        validity: '90 Days',
        cost: 2800,
        currency: 'INR',
        documentsRequired: ['Passport', 'Photo'],
        description: 'eVISA for Malaysia.',
        images: ['https://images.unsplash.com/photo-1596422846543-75c6a4d56536?auto=format&fit=crop&q=80&w=1000']
    }
];

const seedData = async () => {
    try {
        await connectDB();

        await Visa.deleteMany();
        console.log('Existing visas cleared...');

        await Visa.insertMany(sampleVisas);
        console.log('Sample visas imported!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
