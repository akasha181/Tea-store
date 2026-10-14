const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace /images/products/(.*).svg with /images/products/$1.jpg
const regex = /image:\s*['"]\/images\/products\/([a-z0-9-]+)\.svg['"]/g;

let count = 0;
content = content.replace(regex, (match, id) => {
  count++;
  return `image: '/images/products/${id}.jpg'`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Replaced ${count} product image extensions to .jpg in products.ts`);
