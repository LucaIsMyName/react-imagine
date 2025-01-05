import { ArtEffect } from './types';

export const applyModernEffect: ArtEffect = (ctx, img, width, height) => {
  ctx.clearRect(0, 0, width, height);
  
  ctx.drawImage(img, 0, 0, width, height);
  
  const blockSize = Math.min(width, height) * 0.1;
  const numBlocks = 5;
  
  for (let i = 0; i < numBlocks; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = blockSize * (0.5 + Math.random());
    const h = blockSize * (0.5 + Math.random());
    
    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 50%, 0.3)`;
    ctx.fillRect(x, y, w, h);
  }
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.min(width, height) * 0.01;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }
};