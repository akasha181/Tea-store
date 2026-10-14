const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsFilePath, 'utf8');

// Match each product block with id and update its image field to /images/products/{id}.svg
const regex = /(id:\s*['"]([a-z0-9-]+)['"][\s\S]*?image:\s*['"])(https:\/\/images\.unsplash\.com\/[^'"]+)(['"])/g;

let updatedCount = 0;
content = content.replace(regex, (match, prefix, id, oldUrl, suffix) => {
  updatedCount++;
  return `${prefix}/images/products/${id}.svg${suffix}`;
});

fs.writeFileSync(productsFilePath, content, 'utf8');
console.log(`Updated ${updatedCount} products in products.ts with local dummy SVG picture paths.`);
