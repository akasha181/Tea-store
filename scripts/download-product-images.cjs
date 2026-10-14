const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const outputDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const items = [
  // Staples
  {
    id: 'staples-sunridge-atta-10kg',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'staples-desi-chakki-atta-20kg',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'staples-fine-maida-1kg',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'staples-wheat-dalia-1kg',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'staples-pure-suji-1kg',
    url: 'https://images.unsplash.com/photo-1586201375833-2895f00e95c4?auto=format&fit=crop&w=600&q=80'
  },

  // Pulses & Rice
  {
    id: 'pulses-super-basmati-rice-1kg',
    url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pulses-kainat-saila-rice-1kg',
    url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pulses-daal-chana-special-1kg',
    url: 'https://images.unsplash.com/photo-1585996838426-6099c29d4b55?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pulses-daal-moong-dhuli-1kg',
    url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pulses-daal-masoor-whole-1kg',
    url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pulses-daal-mash-washed-1kg',
    url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'
  },

  // Cooking Oils & Ghee
  {
    id: 'cooking-dalda-banaspati-ghee-1kg',
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cooking-habib-oil-canister-5l',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cooking-mehran-desi-sarson-oil-1l',
    url: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cooking-sufi-sunflower-oil-1l',
    url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=600&q=80'
  },

  // Spices & Seasonings
  {
    id: 'spices-national-iodized-salt-800g',
    url: 'https://images.unsplash.com/photo-1518110903415-385002b85e92?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'spices-national-red-chilli-200g',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'spices-mehran-turmeric-haldi-200g',
    url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'spices-whole-cumin-safaid-zeera-100g',
    url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80'
  },

  // Beverages & Dairy
  {
    id: 'beverages-tapal-danedar-tea-430g',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'beverages-refined-white-sugar-1kg',
    url: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'beverages-olpers-full-cream-milk-1l',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    function getWithRedirect(targetUrl, depth = 0) {
      if (depth > 5) {
        return reject(new Error('Too many redirects'));
      }
      const client = targetUrl.startsWith('https') ? https : http;
      client.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return getWithRedirect(res.headers.location, depth + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      }).on('error', (err) => {
        reject(err);
      });
    }

    getWithRedirect(url);
  });
}

async function run() {
  console.log(`Starting download of ${items.length} product images...`);
  let successCount = 0;
  for (const item of items) {
    const destPath = path.join(outputDir, `${item.id}.jpg`);
    try {
      await downloadFile(item.url, destPath);
      const stat = fs.statSync(destPath);
      console.log(`✓ [${++successCount}/${items.length}] Downloaded ${item.id}.jpg (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Failed to download ${item.id}:`, err.message);
    }
  }
  console.log(`Completed. Successfully downloaded ${successCount} images to ${outputDir}`);
}

run();
