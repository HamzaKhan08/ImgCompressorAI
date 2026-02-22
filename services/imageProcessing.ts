import { CropState, CountryPreset } from '../types';
import { MM_TO_INCH } from '../constants';

// Helper to load image
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Calculate approximate file size in KB
export const getFileSizeKB = (base64String: string): number => {
  // Base64 length calculation: (n * 3/4) - padding
  // Simplified estimation is usually sufficient for UI
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  const padding = (base64String.match(/=/g) || []).length;
  const sizeBytes = (base64Length * 0.75) - padding;
  return Math.round(sizeBytes / 1024);
};

// Compress image to specific quality
export const compressImage = async (base64: string, quality: number): Promise<string> => {
  const img = await loadImage(base64);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error("Could not get canvas context");
  
  // White background to handle potential transparency if source was PNG
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg', quality);
};

// Main processing function
export const generatePassportPhoto = async (
  imageSrc: string,
  crop: CropState,
  preset: CountryPreset,
  backgroundColor?: string
): Promise<string> => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error("Could not get canvas context");

  // Calculate pixel dimensions based on DPI
  // width (mm) * mmToInch * dpi
  const targetWidthPx = Math.round(preset.widthMm * MM_TO_INCH * preset.dpi);
  const targetHeightPx = Math.round(preset.heightMm * MM_TO_INCH * preset.dpi);

  canvas.width = targetWidthPx;
  canvas.height = targetHeightPx;

  // Background Fill (if we had segmentation, we'd mask here)
  ctx.fillStyle = backgroundColor || preset.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Math for transforming the image based on crop state
  // The crop state (x, y) is usually a percentage or center offset relative to the viewer.
  // Here we assume a simplified model where crop.x/y are offsets from center in percentage of image size.
  
  // Save context for rotation
  ctx.save();
  
  // Move to center of canvas to rotate around center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((crop.rotation * Math.PI) / 180);
  ctx.scale(crop.zoom, crop.zoom);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw image centered
  // We need to figure out the aspect ratio match
  const imgAspect = image.width / image.height;
  const canvasAspect = canvas.width / canvas.height;

  let drawWidth, drawHeight;

  if (imgAspect > canvasAspect) {
    drawHeight = canvas.height;
    drawWidth = canvas.height * imgAspect;
  } else {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgAspect;
  }

  // Apply Panning (crop.x and crop.y are normally -50 to 50 or similar)
  // Let's assume crop.x/y are pixels to move
  const offsetX = (canvas.width - drawWidth) / 2 + crop.x;
  const offsetY = (canvas.height - drawHeight) / 2 + crop.y;

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  ctx.restore();

  // Return high quality by default, compression handled later
  return canvas.toDataURL('image/jpeg', 1.0);
};

export const generatePrintSheet = async (
  photoDataUrl: string,
  preset: CountryPreset,
  sheetSize: '4x6' | 'A4'
): Promise<string> => {
  const photo = await loadImage(photoDataUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error("No context");

  const dpi = 300;
  let sheetWidthMm = 0;
  let sheetHeightMm = 0;

  if (sheetSize === '4x6') {
    sheetWidthMm = 101.6; // 4 inches
    sheetHeightMm = 152.4; // 6 inches
  } else {
    // A4
    sheetWidthMm = 210;
    sheetHeightMm = 297;
  }

  canvas.width = Math.round(sheetWidthMm * MM_TO_INCH * dpi);
  canvas.height = Math.round(sheetHeightMm * MM_TO_INCH * dpi);

  // White background for the sheet
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gap between photos (2mm)
  const gapPx = Math.round(2 * MM_TO_INCH * dpi);
  
  const photoW = photo.width;
  const photoH = photo.height;

  // Calculate grid
  const cols = Math.floor((canvas.width + gapPx) / (photoW + gapPx));
  const rows = Math.floor((canvas.height + gapPx) / (photoH + gapPx));

  // Center the grid
  const totalGridW = cols * photoW + (cols - 1) * gapPx;
  const totalGridH = rows * photoH + (rows - 1) * gapPx;

  const startX = (canvas.width - totalGridW) / 2;
  const startY = (canvas.height - totalGridH) / 2;

  // Draw crop marks
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = startX + i * (photoW + gapPx);
      const y = startY + j * (photoH + gapPx);
      
      // Draw faint border for cutting
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, photoW, photoH);
      
      ctx.drawImage(photo, x, y, photoW, photoH);
    }
  }

  return canvas.toDataURL('image/jpeg', 0.95);
};