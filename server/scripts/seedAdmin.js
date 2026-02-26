require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const connectDB = require('../config/db');

const seed = async () => {
    await connectDB();
    const exists = await User.findOne({ email: 'admin@rajtravel.com' });

    if (exists) {
        exists.role = 'admin';
        exists.isEmailVerified = true;
        exists.password = 'admin123';
        await exists.save();
        console.log('✅ Admin user updated: admin@rajtravel.com / admin123');
    } else {
        await User.create({
            name: 'Admin',
            email: 'admin@rajtravel.com',
            password: 'admin123',
            role: 'admin',
            isEmailVerified: true
        });
        console.log('✅ Admin user created: admin@rajtravel.com / admin123');
    }
    process.exit(0);
};
seed().catch(e => { console.error(e); process.exit(1); });
