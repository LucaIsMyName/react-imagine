import { ArtEffect } from "./types";

export const applyAbstractEffect: ArtEffect = (ctx, img, width, height) => {
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const numLayers = 3;

  for (let i = 0; i < numLayers; i++) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((Math.PI / 180) * (i * 120));
    ctx.scale(1 - i * 0.2, 1 - i * 0.2);
    ctx.translate(-centerX, -centerY);

    ctx.globalCompositeOperation = i % 2 === 0 ? "screen" : "multiply";
    ctx.drawImage(img, 0, 0, width, height);

    ctx.restore();
  }

  ctx.globalCompositeOperation = "overlay";
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(255,0,0,0.2)");
  gradient.addColorStop(0.5, "rgba(0,255,0,0.2)");
  gradient.addColorStop(1, "rgba(0,0,255,0.2)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};
