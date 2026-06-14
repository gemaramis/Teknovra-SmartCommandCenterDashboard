import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage() {
  try {
    const inputPath = path.join(__dirname, 'src/imports/logo_teknovra.png');
    const outputPath = path.join(__dirname, 'public/favicon.png');
    
    // Read the image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // We assume logogram is on the left. We crop a square box based on height
    // Ensure we don't exceed width
    const size = Math.min(metadata.width, metadata.height);
    
    await image
      .extract({ left: 0, top: 0, width: size, height: size })
      .resize(128, 128)
      .png()
      .toFile(outputPath);
      
    console.log("Successfully created favicon.png", { width: metadata.width, height: metadata.height, croppedSize: size });
  } catch (err) {
    console.error("Error cropping image:", err);
  }
}

processImage();
