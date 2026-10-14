const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const outputDir = path.join(__dirname, '..', 'public', 'images', 'products');

const candidates = [
  {
    id: 'staples-pure-suji-1kg',
    urls: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'pulses-daal-chana-special-1kg',
    urls: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'spices-national-iodized-salt-800g',
    urls: [
      'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    function getWithRedirect(targetUrl, depth = 0) {
      if (depth > 5) return reject(new Error('Too many redirects'));
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return getWithRedirect(res.headers.location, depth + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      }).on('error', reject);
    }
    getWithRedirect(url);
  });
}

async function run() {
  for (const item of candidates) {
    const dest = path.join(outputDir, `${item.id}.jpg`);
    for (const url of item.urls) {
      try {
        await downloadFile(url, dest);
        console.log(`✓ Downloaded ${item.id}.jpg successfully`);
        break;
      } catch (err) {
        console.log(`Failed url for ${item.id}, trying next...`);
      }
    }
  }
}

run();
