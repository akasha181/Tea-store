const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'products.ts'), 'utf8');
const productsIndex = content.indexOf('export const INITIAL_PRODUCTS: Product[] = [');
const productsPart = content.slice(productsIndex);

const items = productsPart.split(/\{\s*id:/).slice(1);
const mismatches = [];

for (const item of items) {
  const idMatch = item.match(/^\s*['"]([a-z0-9-]+)['"]/);
  const imageMatch = item.match(/image:\s*['"]([^'"]+)['"]/);
  if (idMatch && imageMatch) {
    const id = idMatch[1];
    const image = imageMatch[1];
    const expected = `/images/products/${id}.svg`;
    const fullPath = path.join(__dirname, '..', 'public', image);
    const exists = fs.existsSync(fullPath);
    console.log(`${id} => ${image} (file exists: ${exists})`);
    if (image !== expected || !exists) {
      mismatches.push({ id, image, expected, exists });
    }
  }
}

if (mismatches.length > 0) {
  console.error('MISMATCHES FOUND:', mismatches);
  process.exit(1);
} else {
  console.log(`ALL ${items.length} PRODUCTS MATCH DUMMY SVG IMAGES PERFECTLY!`);
}
