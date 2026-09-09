const fs = require('fs');
const path = require('path');

// Let's read the products in data/products.json
const productsFile = path.resolve('./data/products.json');
let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

console.log('Original product count:', products.length);

// Filter out all "Video Surveillance & Cameras"
const nonVSC = products.filter(p => p.category.toLowerCase().trim() !== 'video surveillance & cameras');
console.log('Non-VSC count:', nonVSC.length);
console.log('Removed VSC count:', products.length - nonVSC.length);

