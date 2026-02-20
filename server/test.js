console.log('Hello from test.js');
try {
    require('dotenv').config();
    console.log('Dotenv loaded');
    const app = require('./app');
    console.log('App loaded');
} catch (e) {
    console.error('Error:', e);
}
