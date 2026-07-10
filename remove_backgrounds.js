const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

// Target directories relative to this frontend directory
const publicDir = path.join(__dirname, 'public');
const productsDir = path.join(publicDir, 'products');
const heroDir = path.join(publicDir, 'hero');
const lookbookDir = path.join(publicDir, 'lookbook');

console.log('Target Public Dir:', publicDir);

async function processFile(filePath) {
  try {
    console.log(`Processing file: ${path.basename(filePath)}...`);
    const startTime = Date.now();
    
    // Read local file as a Buffer to avoid Windows path protocol resolution issues
    const imageBuffer = fs.readFileSync(filePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    
    // Perform background removal (returns a Blob of transparent PNG)
    const blob = await removeBackground(imageBlob);
    const buffer = Buffer.from(await blob.arrayBuffer());
    
    // Overwrite the original file with the transparent PNG cutout
    fs.writeFileSync(filePath, buffer);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✓ Completed: ${path.basename(filePath)} in ${duration}s`);
  } catch (error) {
    console.error(`✗ Failed to process ${path.basename(filePath)}:`, error.message);
  }
}

async function run() {
  console.log('Initializing ONNX Background Removal Model...');
  
  // 1. Process Product Images (product-1.png to product-40.png)
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.png'));
    console.log(`Found ${files.length} product images in ${productsDir}`);
    for (const file of files) {
      const filePath = path.join(productsDir, file);
      await processFile(filePath);
    }
  }

  // 2. Process Hero Images (hero-1.png to hero-5.png)
  if (fs.existsSync(heroDir)) {
    const files = fs.readdirSync(heroDir).filter(f => f.endsWith('.png'));
    console.log(`Found ${files.length} hero images in ${heroDir}`);
    for (const file of files) {
      const filePath = path.join(heroDir, file);
      await processFile(filePath);
    }
  }

  // 3. Process Lookbook Images (lookbook-1.png to lookbook-15.png)
  if (fs.existsSync(lookbookDir)) {
    const files = fs.readdirSync(lookbookDir).filter(f => f.endsWith('.png'));
    console.log(`Found ${files.length} lookbook images in ${lookbookDir}`);
    for (const file of files) {
      const filePath = path.join(lookbookDir, file);
      await processFile(filePath);
    }
  }

  console.log('Background removal processing complete!');
}

run();
