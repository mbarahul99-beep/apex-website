const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;
  const webpPath = filePath.slice(0, -ext.length) + '.webp';
  
  try {
    const info = await sharp(filePath).webp({ quality: 82 }).toFile(webpPath);
    const origStat = fs.statSync(filePath);
    console.log(`Converted: ${path.relative(publicDir, filePath)} (${Math.round(origStat.size / 1024)} KB) -> ${path.relative(publicDir, webpPath)} (${Math.round(info.size / 1024)} KB)`);
  } catch (err) {
    console.error(`Error converting ${filePath}:`, err.message);
  }
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else {
      await convertFile(fullPath);
    }
  }
}

(async () => {
  console.log('Converting all public images to WebP...');
  await walk(publicDir);
  console.log('Conversion complete!');
})();
