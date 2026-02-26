const https = require('https');

const urls = [
    // JAN
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', // Maldives
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', // Australia
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', // Thailand
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800', // New Zealand
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', // Swiss Alps
    'https://images.unsplash.com/photo-1516483638261-f4085ee6b633?w=800', // Venice
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', // Rome
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', // Jaipur
    // FEB
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', // Bali
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', // Dubai
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', // Singapore
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', // Kerala
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', // Vietnam
    'https://images.unsplash.com/photo-1544411047-c4cb3b7d1e8c?w=800', // Meghalaya
    'https://images.unsplash.com/photo-1522616212176-381c13cb8972?w=800', // Darjeeling
    'https://images.unsplash.com/photo-1516024161749-fabe7cf4795e?w=800', // South Africa
    // MAR
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', // Japan
    'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=800', // Sri Lanka
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', // Nepal
    'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?w=800', // Amsterdam
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', // Paris
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', // Barcelona
    'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800', // Andaman
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', // Goa
    // APR
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', // Greece
    'https://images.unsplash.com/photo-1533591380344-9de6fdbca047?w=800', // Bhutan
    'https://images.unsplash.com/photo-1515238152791-8225bf451d2e?w=800', // Mauritius
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', // Turkey
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', // Kashmir
    'https://images.unsplash.com/photo-1540202404-b9b2fb1e8ec5?w=800', // Seychelles
    'https://images.unsplash.com/photo-1544645398-963d8ce7b707?w=800', // Sikkim
    'https://images.unsplash.com/photo-1555589998-2ffcfdc6afae?w=800', // Oman
    // MAY
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800', // Switzerland
    'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800', // Italy
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', // Himachal
    'https://images.unsplash.com/photo-1506450682281-aee43da52c67?w=800', // Scotland
    'https://images.unsplash.com/photo-1527004013195-2a3b9050d87a?w=800', // Norway
    'https://images.unsplash.com/photo-1580132371901-b6a836da3fae?w=800', // Ladakh
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', // Croatia
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800', // Canada
    // JUN
    'https://images.unsplash.com/photo-1513635269975-59693e2d8ce0?w=800', // London
    'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', // Iceland
    'https://images.unsplash.com/photo-1526392060635-9d60198d3fe3?w=800', // Peru
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', // Kenya
    'https://images.unsplash.com/photo-1507608240590-bdf1df063fa2?w=800', // Fiji
    'https://images.unsplash.com/photo-1533587900720-63eb5caeeeba?w=800', // Alaska
    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800', // Prague
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800'  // Berlin
];

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode >= 400) {
                console.log(\`FAILED: \${url} (Status: \${res.statusCode})\`);
            }
            resolve();
        }).on('error', (e) => {
            console.log(\`ERROR: \${url} (\${e.message})\`);
            resolve();
        });
    });
}

async function run() {
    console.log('Checking URLs...');
    for (const url of urls) {
        await checkUrl(url);
    }
    console.log('Done.');
}

run();
