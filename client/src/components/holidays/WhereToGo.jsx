import React, { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Harcoded visually stunning destinations based on the month specifically for the UI circles.
// In a fully dynamic app, these could be pulled from the API, but for the complex multi-circle visual layout, 
// a curated set of highlight cards works best to match the exact aesthetic of the provided screenshot.
const MONTH_HIGHLIGHTS = {
    'JAN': [
        { name: 'Maldives', price: '₹51,503/-', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', type: 'large-square' },
        { name: 'Australia', price: '₹38,894/-', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', type: 'large-square' },
        { name: 'Thailand', price: '₹14,040/-', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', type: 'large-square' },
        { name: 'New Zealand', price: '₹65,626/-', img: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800', type: 'large-square' },
        { name: 'Swiss Alps', price: '', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', type: 'circle-hero' },
        { name: 'Venice', price: '', img: 'https://images.unsplash.com/photo-1516483638261-f4085ee6b633?w=800', type: 'circle-small-1' },
        { name: 'Rome', price: '', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', type: 'circle-small-2' },
        { name: 'Jaipur', price: '', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', type: 'circle-large-bottom' },
    ],
    'FEB': [
        { name: 'Bali', price: '₹42,999/-', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', type: 'large-square' },
        { name: 'Dubai', price: '₹54,999/-', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', type: 'large-square' },
        { name: 'Singapore', price: '₹49,999/-', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', type: 'large-square' },
        { name: 'Kerala', price: '₹24,999/-', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', type: 'large-square' },
        { name: 'Vietnam', price: '', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', type: 'circle-hero' },
        { name: 'Meghalaya', price: '', img: 'https://images.unsplash.com/photo-1544411047-c4cb3b7d1e8c?w=800', type: 'circle-small-1' },
        { name: 'Darjeeling', price: '', img: 'https://images.unsplash.com/photo-1522616212176-381c13cb8972?w=800', type: 'circle-small-2' },
        { name: 'South Africa', price: '', img: 'https://images.unsplash.com/photo-1516024161749-fabe7cf4795e?w=800', type: 'circle-large-bottom' },
    ],
    'MAR': [
        { name: 'Japan', price: '₹89,999/-', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', type: 'large-square' },
        { name: 'Sri Lanka', price: '₹32,500/-', img: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=800', type: 'large-square' },
        { name: 'Nepal', price: '₹28,000/-', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', type: 'large-square' },
        { name: 'Amsterdam', price: '₹65,000/-', img: 'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?w=800', type: 'large-square' },
        { name: 'Paris', price: '', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', type: 'circle-hero' },
        { name: 'Barcelona', price: '', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', type: 'circle-small-1' },
        { name: 'Andaman', price: '', img: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800', type: 'circle-small-2' },
        { name: 'Goa', price: '', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', type: 'circle-large-bottom' },
    ],
    'APR': [
        { name: 'Greece', price: '₹75,000/-', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', type: 'large-square' },
        { name: 'Bhutan', price: '₹45,000/-', img: 'https://images.unsplash.com/photo-1533591380344-9de6fdbca047?w=800', type: 'large-square' },
        { name: 'Mauritius', price: '₹55,500/-', img: 'https://images.unsplash.com/photo-1515238152791-8225bf451d2e?w=800', type: 'large-square' },
        { name: 'Turkey', price: '₹68,000/-', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', type: 'large-square' },
        { name: 'Kashmir', price: '', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', type: 'circle-hero' },
        { name: 'Seychelles', price: '', img: 'https://images.unsplash.com/photo-1540202404-b9b2fb1e8ec5?w=800', type: 'circle-small-1' },
        { name: 'Sikkim', price: '', img: 'https://images.unsplash.com/photo-1544645398-963d8ce7b707?w=800', type: 'circle-small-2' },
        { name: 'Oman', price: '', img: 'https://images.unsplash.com/photo-1555589998-2ffcfdc6afae?w=800', type: 'circle-large-bottom' },
    ],
    'MAY': [
        { name: 'Switzerland', price: '₹95,000/-', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800', type: 'large-square' },
        { name: 'Italy', price: '₹85,000/-', img: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800', type: 'large-square' },
        { name: 'Himachal', price: '₹18,000/-', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', type: 'large-square' },
        { name: 'Scotland', price: '₹78,000/-', img: 'https://images.unsplash.com/photo-1506450682281-aee43da52c67?w=800', type: 'large-square' },
        { name: 'Norway', price: '', img: 'https://images.unsplash.com/photo-1527004013195-2a3b9050d87a?w=800', type: 'circle-hero' },
        { name: 'Ladakh', price: '', img: 'https://images.unsplash.com/photo-1580132371901-b6a836da3fae?w=800', type: 'circle-small-1' },
        { name: 'Croatia', price: '', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', type: 'circle-small-2' },
        { name: 'Canada', price: '', img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800', type: 'circle-large-bottom' },
    ],
    'JUN': [
        { name: 'London', price: '₹82,000/-', img: 'https://images.unsplash.com/photo-1513635269975-59693e2d8ce0?w=800', type: 'large-square' },
        { name: 'Iceland', price: '₹110,000/-', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', type: 'large-square' },
        { name: 'Peru', price: '₹105,000/-', img: 'https://images.unsplash.com/photo-1526392060635-9d60198d3fe3?w=800', type: 'large-square' },
        { name: 'Kenya', price: '₹95,000/-', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', type: 'large-square' },
        { name: 'Fiji', price: '', img: 'https://images.unsplash.com/photo-1507608240590-bdf1df063fa2?w=800', type: 'circle-hero' },
        { name: 'Alaska', price: '', img: 'https://images.unsplash.com/photo-1533587900720-63eb5caeeeba?w=800', type: 'circle-small-1' },
        { name: 'Prague', price: '', img: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800', type: 'circle-small-2' },
        { name: 'Berlin', price: '', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800', type: 'circle-large-bottom' },
    ],
    'JUL': [
        { name: 'Maldives', price: '₹51,503/-', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', type: 'large-square' },
        { name: 'Australia', price: '₹38,894/-', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', type: 'large-square' },
        { name: 'Thailand', price: '₹14,040/-', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', type: 'large-square' },
        { name: 'New Zealand', price: '₹65,626/-', img: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800', type: 'large-square' },
        { name: 'Swiss Alps', price: '', img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', type: 'circle-hero' },
        { name: 'Venice', price: '', img: 'https://images.unsplash.com/photo-1516483638261-f4085ee6b633?w=800', type: 'circle-small-1' },
        { name: 'Rome', price: '', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', type: 'circle-small-2' },
        { name: 'Jaipur', price: '', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', type: 'circle-large-bottom' },
    ],
    'AUG': [
        { name: 'Bali', price: '₹42,999/-', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', type: 'large-square' },
        { name: 'Dubai', price: '₹54,999/-', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', type: 'large-square' },
        { name: 'Singapore', price: '₹49,999/-', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', type: 'large-square' },
        { name: 'Kerala', price: '₹24,999/-', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', type: 'large-square' },
        { name: 'Vietnam', price: '', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', type: 'circle-hero' },
        { name: 'Meghalaya', price: '', img: 'https://images.unsplash.com/photo-1544411047-c4cb3b7d1e8c?w=800', type: 'circle-small-1' },
        { name: 'Darjeeling', price: '', img: 'https://images.unsplash.com/photo-1522616212176-381c13cb8972?w=800', type: 'circle-small-2' },
        { name: 'South Africa', price: '', img: 'https://images.unsplash.com/photo-1516024161749-fabe7cf4795e?w=800', type: 'circle-large-bottom' },
    ],
    'SEP': [
        { name: 'Japan', price: '₹89,999/-', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', type: 'large-square' },
        { name: 'Sri Lanka', price: '₹32,500/-', img: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=800', type: 'large-square' },
        { name: 'Nepal', price: '₹28,000/-', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', type: 'large-square' },
        { name: 'Amsterdam', price: '₹65,000/-', img: 'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?w=800', type: 'large-square' },
        { name: 'Paris', price: '', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', type: 'circle-hero' },
        { name: 'Barcelona', price: '', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', type: 'circle-small-1' },
        { name: 'Andaman', price: '', img: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800', type: 'circle-small-2' },
        { name: 'Goa', price: '', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', type: 'circle-large-bottom' },
    ],
    'OCT': [
        { name: 'Greece', price: '₹75,000/-', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', type: 'large-square' },
        { name: 'Bhutan', price: '₹45,000/-', img: 'https://images.unsplash.com/photo-1533591380344-9de6fdbca047?w=800', type: 'large-square' },
        { name: 'Mauritius', price: '₹55,500/-', img: 'https://images.unsplash.com/photo-1515238152791-8225bf451d2e?w=800', type: 'large-square' },
        { name: 'Turkey', price: '₹68,000/-', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', type: 'large-square' },
        { name: 'Kashmir', price: '', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', type: 'circle-hero' },
        { name: 'Seychelles', price: '', img: 'https://images.unsplash.com/photo-1540202404-b9b2fb1e8ec5?w=800', type: 'circle-small-1' },
        { name: 'Sikkim', price: '', img: 'https://images.unsplash.com/photo-1544645398-963d8ce7b707?w=800', type: 'circle-small-2' },
        { name: 'Oman', price: '', img: 'https://images.unsplash.com/photo-1555589998-2ffcfdc6afae?w=800', type: 'circle-large-bottom' },
    ],
    'NOV': [
        { name: 'Switzerland', price: '₹95,000/-', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800', type: 'large-square' },
        { name: 'Italy', price: '₹85,000/-', img: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800', type: 'large-square' },
        { name: 'Himachal', price: '₹18,000/-', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', type: 'large-square' },
        { name: 'Scotland', price: '₹78,000/-', img: 'https://images.unsplash.com/photo-1506450682281-aee43da52c67?w=800', type: 'large-square' },
        { name: 'Norway', price: '', img: 'https://images.unsplash.com/photo-1527004013195-2a3b9050d87a?w=800', type: 'circle-hero' },
        { name: 'Ladakh', price: '', img: 'https://images.unsplash.com/photo-1580132371901-b6a836da3fae?w=800', type: 'circle-small-1' },
        { name: 'Croatia', price: '', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', type: 'circle-small-2' },
        { name: 'Canada', price: '', img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800', type: 'circle-large-bottom' },
    ],
    'DEC': [
        { name: 'London', price: '₹82,000/-', img: 'https://images.unsplash.com/photo-1513635269975-59693e2d8ce0?w=800', type: 'large-square' },
        { name: 'Iceland', price: '₹110,000/-', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', type: 'large-square' },
        { name: 'Peru', price: '₹105,000/-', img: 'https://images.unsplash.com/photo-1526392060635-9d60198d3fe3?w=800', type: 'large-square' },
        { name: 'Kenya', price: '₹95,000/-', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', type: 'large-square' },
        { name: 'Fiji', price: '', img: 'https://images.unsplash.com/photo-1507608240590-bdf1df063fa2?w=800', type: 'circle-hero' },
        { name: 'Alaska', price: '', img: 'https://images.unsplash.com/photo-1533587900720-63eb5caeeeba?w=800', type: 'circle-small-1' },
        { name: 'Prague', price: '', img: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800', type: 'circle-small-2' },
        { name: 'Berlin', price: '', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800', type: 'circle-large-bottom' },
    ],
    'DEFAULT': [
        { name: 'Bali', price: '₹42,999/-', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', type: 'large-square' },
        { name: 'Dubai', price: '₹54,999/-', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', type: 'large-square' },
        { name: 'Singapore', price: '₹49,999/-', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', type: 'large-square' },
        { name: 'Kerala', price: '₹24,999/-', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', type: 'large-square' },
        { name: 'Vietnam', price: '', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', type: 'circle-hero' },
        { name: 'Meghalaya', price: '', img: 'https://images.unsplash.com/photo-1544411047-c4cb3b7d1e8c?w=800', type: 'circle-small-1' },
        { name: 'Darjeeling', price: '', img: 'https://images.unsplash.com/photo-1522616212176-381c13cb8972?w=800', type: 'circle-small-2' },
        { name: 'South Africa', price: '', img: 'https://images.unsplash.com/photo-1516024161749-fabe7cf4795e?w=800', type: 'circle-large-bottom' },
    ]
};

const WhereToGo = ({ onSearchMonth }) => {
    const [activeMonth, setActiveMonth] = useState('JAN');

    const handleMonthClick = (month) => {
        setActiveMonth(month);
    };

    const highlights = MONTH_HIGHLIGHTS[activeMonth] || MONTH_HIGHLIGHTS['DEFAULT'];

    return (
        <section className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Where to go when</h2>

            {/* Months Strip */}
            <div className="flex items-center justify-between border-b border-gray-100 mb-8 pb-2">
                <div className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar flex-1">
                    {MONTHS.map(month => (
                        <button
                            key={month}
                            onClick={() => handleMonthClick(month)}
                            className={`font-bold text-sm tracking-widest transition-colors relative pb-2 ${activeMonth === month ? 'text-teal-700' : 'text-gray-400 hover:text-gray-800'
                                }`}
                        >
                            {month}
                            {activeMonth === month && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-md" />
                            )}
                        </button>
                    ))}
                </div>
                {/* Optional Arrows for mobile scroll indicator */}
                <div className="hidden md:flex gap-2 ml-4">
                    <button className="w-8 h-8 rounded-full bg-gray-200 text-white flex items-center justify-center cursor-not-allowed">
                        <FaChevronLeft size={12} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 transition-colors">
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            {/* Mosaic Gallery */}
            <div className="flex flex-col xl:flex-row gap-6">

                {/* Left: 4 Square Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:w-2/3">
                    {highlights.filter(h => h.type === 'large-square').map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 group relative h-48 md:h-64 cursor-pointer" onClick={() => onSearchMonth(activeMonth)}>
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-white font-bold text-lg leading-tight">{item.name}</h3>
                                {item.price && <p className="text-white font-black opacity-90">{item.price}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Circular Art Collage (Hidden on small screens for layout sanity, visible on lg+) */}
                <div className="hidden xl:block xl:w-1/3 relative h-64">
                    {highlights.filter(h => h.type === 'circle-hero').map((item, i) => (
                        <div key={i} className="absolute left-0 top-0 w-64 h-64 rounded-full overflow-hidden shadow-xl border-4 border-white z-20 hover:scale-105 transition-transform duration-500 cursor-pointer" onClick={() => onSearchMonth(activeMonth)}>
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {highlights.filter(h => h.type === 'circle-small-1').map((item, i) => (
                        <div key={i} className="absolute right-12 top-12 w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-white z-10 hover:scale-110 transition-transform duration-500">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {highlights.filter(h => h.type === 'circle-small-2').map((item, i) => (
                        <div key={i} className="absolute right-16 bottom-16 w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white z-30 hover:scale-110 transition-transform duration-500">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {highlights.filter(h => h.type === 'circle-large-bottom').map((item, i) => (
                        <div key={i} className="absolute left-48 bottom-0 w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white z-30 hover:scale-105 transition-transform duration-500 cursor-pointer" onClick={() => onSearchMonth(activeMonth)}>
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhereToGo;
