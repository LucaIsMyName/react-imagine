// src/lib/effects/raster.ts
import { ArtEffect } from "./types";

interface RasterConfig {
  granularity: number; // 0-100
  randomness: number; // 0-100
}

const extractColorChannel = (
  imageData: ImageData,
  channel: 0 | 1 | 2, // 0=R, 1=G, 2=B
  width: number,
  height: number
): number[][] => {
  const matrix: number[][] = [];
  for (let y = 0; y < height; y++) {
    matrix[y] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      matrix[y][x] = imageData.data[i + channel];
    }
  }
  return matrix;
};

const resetContext = (ctx: CanvasRenderingContext2D) => {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
};

const applyDotRaster = (ctx: CanvasRenderingContext2D, channelMatrix: number[][], color: string, config: RasterConfig, offsetX = 0, offsetY = 0) => {
  const height = channelMatrix.length;
  const width = channelMatrix[0].length;

  // Adjust step size based on granularity (1-20 pixels)
  const step = Math.max(1, Math.round(20 * (1 - config.granularity / 100)));

  // Scale randomness to a more controlled range
  const randomnessFactor = (config.randomness / 50) * step * 0.33;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let sum = 0;
      let count = 0;
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          sum += channelMatrix[y + dy][x + dx];
          count++;
        }
      }
      const intensity = sum / (count * 255);

      if (intensity > 0.1) {
        const randomX = (Math.random() - 0.5) * randomnessFactor;
        const randomY = (Math.random() - 0.5) * randomnessFactor;

        const dotX = Math.min(width - 1, Math.max(0, x + offsetX + step / 2 + randomX));
        const dotY = Math.min(height - 1, Math.max(0, y + offsetY + step / 2 + randomY));

        const baseSize = (step / 2) * intensity;
        const sizeVariation = baseSize * 0.2 * (config.randomness / 100);
        const radius = baseSize + (Math.random() - 0.5) * sizeVariation;

        ctx.beginPath();
        ctx.arc(dotX, dotY, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = intensity * 0.9; // Slightly reduced opacity
        ctx.fill();
      }
    }
  }
};

const applyLineRaster = (ctx: CanvasRenderingContext2D, channelMatrix: number[][], color: string, config: RasterConfig, vertical: boolean, offsetX = 0, offsetY = 0) => {
  const height = channelMatrix.length;
  const width = channelMatrix[0].length;

  const step = Math.max(1, Math.round(20 * (1 - config.granularity / 100)));
  const randomnessFactor = (config.randomness / 100) * step * 0.33;

  if (vertical) {
    for (let x = 0; x < width; x += step) {
      let lastY = 0;
      let currentIntensity = 0;

      for (let y = 0; y < height; y++) {
        const intensity = channelMatrix[y][x] / 255;

        if (Math.abs(intensity - currentIntensity) > 0.1 || y === height - 1) {
          if (currentIntensity > 0.1) {
            const lineX = x + offsetX + (Math.random() - 0.5) * randomnessFactor;
            ctx.beginPath();
            ctx.moveTo(lineX, lastY + offsetY);
            ctx.lineTo(lineX, y + offsetY);
            ctx.strokeStyle = color;
            ctx.globalAlpha = currentIntensity * 0.9;
            ctx.lineWidth = step * (0.5 + currentIntensity * 0.5);
            ctx.stroke();
          }
          lastY = y;
          currentIntensity = intensity / 1.5;
        }
      }
    }
  } else {
    for (let y = 0; y < height; y += step) {
      let lastX = 0;
      let currentIntensity = 0;

      for (let x = 0; x < width; x++) {
        const intensity = channelMatrix[y][x] / 255;

        if (Math.abs(intensity - currentIntensity) > 0.1 || x === width - 1) {
          if (currentIntensity > 0.1) {
            const lineY = y + offsetY + (Math.random() - 0.5) * randomnessFactor;
            ctx.beginPath();
            ctx.moveTo(lastX + offsetX, lineY);
            ctx.lineTo(x + offsetX, lineY);
            ctx.strokeStyle = color;
            ctx.globalAlpha = currentIntensity * 0.9;
            ctx.lineWidth = step * (0.5 + currentIntensity * 0.5);
            ctx.stroke();
          }
          lastX = x;
          currentIntensity = intensity;
        }
      }
    }
  }
};

export const applyRasterEffect = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | HTMLCanvasElement, width: number, height: number, style: "dots" | "lines-horizontal" | "lines-vertical", config: RasterConfig) => {
  // Create temporary canvas for analysis
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return;

  // Reset context state before starting
  resetContext(ctx);

  tempCtx.drawImage(img, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);

  // Extract color channels
  const redChannel = extractColorChannel(imageData, 0, width, height);
  const greenChannel = extractColorChannel(imageData, 1, width, height);
  const blueChannel = extractColorChannel(imageData, 2, width, height);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Set blend mode for color mixing
  ctx.globalCompositeOperation = "screen";

  // Apply effect for each color channel
  if (style === "dots") {
    applyDotRaster(ctx, redChannel, "magenta", config, 0, 0);
    applyDotRaster(ctx, greenChannel, "yellow", config, 1, 1);
    applyDotRaster(ctx, blueChannel, "cyan", config, -1, -1);
  } else {
    const isVertical = style === "lines-vertical";
    applyLineRaster(ctx, redChannel, "magenta", config, isVertical, 0, 0);
    applyLineRaster(ctx, greenChannel, "yellow", config, isVertical, 1, 1);
    applyLineRaster(ctx, blueChannel, "cyan", config, isVertical, -1, -1);
  }

  // Reset context state after effect is applied
  resetContext(ctx);
};
