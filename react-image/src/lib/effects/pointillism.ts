// src/lib/effects/pointillism.ts
import { ArtEffect } from './types';

export const applyPointillismEffect: ArtEffect = (ctx, img, width, height) => {
  ctx.clearRect(0, 0, width, height);
    
  const dotSize = Math.max(2, Math.min(width, height) * 0.004);
  const spacing = dotSize * 2;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCtx.drawImage(img, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  
  ctx.fillStyle = '#000';
  
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const i = (y * width + x) * 4;
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      
      ctx.beginPath();
      ctx.arc(
        x + (Math.random() - 0.5) * spacing * 0.5,
        y + (Math.random() - 0.5) * spacing * 0.5,
        dotSize * (0.5 + Math.random() * 0.5),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();
    }
  }
};