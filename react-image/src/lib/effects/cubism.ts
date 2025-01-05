import { ArtEffect } from './types';

export const applyCubismEffect: ArtEffect = (ctx, img, width, height) => {
  ctx.clearRect(0, 0, width, height);

  const minSize = Math.min(width, height) * 0.05;
  const maxSize = Math.min(width, height) * 0.15;
  const shapes = 150;

  for (let i = 0; i < shapes; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = minSize + Math.random() * (maxSize - minSize);

    ctx.save();
    ctx.beginPath();

    if (Math.random() > 0.5) {
      const angle = Math.random() * Math.PI * 2;
      ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      ctx.lineTo(x + Math.cos(angle + 2.1) * size, y + Math.sin(angle + 2.1) * size);
      ctx.lineTo(x + Math.cos(angle + 4.2) * size, y + Math.sin(angle + 4.2) * size);
    } else {
      const sides = 4 + Math.floor(Math.random() * 3);
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
    ctx.clip();

    const offset = size * 0.1;
    ctx.drawImage(
      img,
      x - size + (Math.random() - 0.5) * offset,
      y - size + (Math.random() - 0.5) * offset,
      size * 2,
      size * 2,
      x - size,
      y - size,
      size * 2,
      size * 2
    );

    ctx.restore();
  }
};
