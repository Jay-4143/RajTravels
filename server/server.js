const express = require('express');
const mongoose = require('mongoose');
// const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Travel Platform API is running...");
});

app.get("/api/flights", (req, res) => {
    const flights = [
        {
            id: 1,
            airline: "IndiGo Airlines",
            from: "Delhi (DEL)",
            to: "Mumbai (BOM)",
            price: 4500,
        },
        {
            id: 2,
            airline: "Air India",
            from: "Delhi (DEL)",
            to: "Mumbai (BOM)",
            price: 5200,
        },
        {
            id: 3,
            airline: "Vistara",
            from: "Delhi (DEL)",
            to: "Mumbai (BOM)",
            price: 4800,
         },
    ];
    res.json(flights);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
