const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'client/src/components/holidays/WhereToGo.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

const monthHighlightsObj = `const MONTH_HIGHLIGHTS = {
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
};`;

const regex = /const MONTH_HIGHLIGHTS = \{[\s\S]*?'DEFAULT': \[[\s\S]*?\]\n\};/;
const newContent = content.replace(regex, monthHighlightsObj);

fs.writeFileSync(targetFile, newContent, 'utf8');
console.log('Successfully updated WhereToGo.jsx with 12 months.');
