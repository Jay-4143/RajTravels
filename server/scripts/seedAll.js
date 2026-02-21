/**
 * Run all seed scripts in sequence
 * Usage: node scripts/seedAll.js
 */
const { execSync } = require('child_process');
const path = require('path');

const scripts = ['seedHotels.js', 'seedBuses.js', 'seedVisas.js', 'seedPackages.js', 'seedCruises.js', 'seedCabs.js'];

console.log('🌱 Seeding all data...\n');

for (const script of scripts) {
    const filePath = path.join(__dirname, script);
    console.log(`▸ Running ${script}...`);
    try {
        const output = execSync(`node "${filePath}"`, { encoding: 'utf-8', cwd: path.join(__dirname, '..') });
        console.log(`  ${output.trim().split('\n').slice(-1)[0]}`);
    } catch (err) {
        console.error(`  ✗ Failed: ${err.message}`);
    }
}

console.log('\n✅ All seeding complete!');
