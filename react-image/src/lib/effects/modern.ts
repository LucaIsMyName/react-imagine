import { ArtEffect } from "./types";

const getModernConfig = (granularity: number, randomness: number) => ({
  segments: {
    // Granularity controls number of segments (0-100)
    count: Math.max(2, Math.round((12 * (100 - granularity)) / 100)), // Inverse relationship
    overlap: 0.12,
    // Randomness affects segment distortion (0-100)
    randomness: 0.05 * (randomness / 50),
    rotationMax: (Math.PI / 12) * (randomness / 50),
  },

  style: {
    backgroundColor: "#f5f0e1",
    borderWidth: 0.006,
    boldLineWidth: 0.008,
    borderOpacity: 0.8,
    // Randomness affects contrast and saturation
    contrast: 60 * (1 + (randomness - 50) / 100),
    saturationBoost: 0.3 * (1 + (randomness - 50) / 100),
  },

  texture: {
    noiseOpacity: 15 * (randomness / 50),
    weaveSpacing: 3,
    weaveOpacity: 0.03,
    vignetteStrength: 0.2,
  },

  colors: ["rgba(41, 58, 128, 0.15)", "rgba(165, 42, 42, 0.15)", "rgba(156, 175, 136, 0.15)", "rgba(189, 183, 107, 0.15)"] as const,
});

// Utility functions
const createCanvasTexture = (ctx: CanvasRenderingContext2D, width: number, height: number): HTMLCanvasElement => {
  const MODERN_CONFIG = getModernConfig(50, 30);
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureCtx = textureCanvas.getContext("2d")!;

  // Create noise pattern
  const imageData = textureCtx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = 255 * (0.95 + Math.random() * 0.05);
    data[i] = value; // r
    data[i + 1] = value; // g
    data[i + 2] = value; // b
    data[i + 3] = MODERN_CONFIG.texture.noiseOpacity;
  }

  textureCtx.putImageData(imageData, 0, 0);

  // Create weave pattern
  textureCtx.strokeStyle = `rgba(0, 0, 0, ${MODERN_CONFIG.texture.weaveOpacity})`;
  textureCtx.lineWidth = 1;

  // Vertical lines
  for (let i = 0; i < width; i += MODERN_CONFIG.texture.weaveSpacing) {
    textureCtx.beginPath();
    textureCtx.moveTo(i, 0);
    textureCtx.lineTo(i, height);
    textureCtx.stroke();
  }

  // Horizontal lines
  for (let i = 0; i < height; i += MODERN_CONFIG.texture.weaveSpacing) {
    textureCtx.beginPath();
    textureCtx.moveTo(0, i);
    textureCtx.lineTo(width, i);
    textureCtx.stroke();
  }

  return textureCanvas;
};

const enhanceContrast = (imageData: ImageData): ImageData => {
  const MODERN_CONFIG = getModernConfig(50, 30);
  const data = imageData.data;
  const factor = (259 * (MODERN_CONFIG.style.contrast + 255)) / (255 * (259 - MODERN_CONFIG.style.contrast));

  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;

    // Apply saturation boost
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i] + (data[i] - avg) * MODERN_CONFIG.style.saturationBoost;
    data[i + 1] = data[i + 1] + (data[i + 1] - avg) * MODERN_CONFIG.style.saturationBoost;
    data[i + 2] = data[i + 2] + (data[i + 2] - avg) * MODERN_CONFIG.style.saturationBoost;
  }

  return imageData;
};

export const applyModernEffect: ArtEffect = (ctx, img, width, height, config?: { granularity?: number; randomness?: number }) => {
  const MODERN_CONFIG = getModernConfig(config?.granularity ?? 50, config?.randomness ?? 30);
  // Clear canvas and set background
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = MODERN_CONFIG.style.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const segmentWidth = width / MODERN_CONFIG.segments.count;
  const segmentHeight = height / MODERN_CONFIG.segments.count;

  // Temporary canvas for processing segments
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCanvas.width = Math.ceil(segmentWidth * (1 + MODERN_CONFIG.segments.overlap));
  tempCanvas.height = Math.ceil(segmentHeight * (1 + MODERN_CONFIG.segments.overlap));

  // Draw segments
  for (let i = 0; i < MODERN_CONFIG.segments.count; i++) {
    for (let j = 0; j < MODERN_CONFIG.segments.count; j++) {
      ctx.save();

      const x = i * segmentWidth;
      const y = j * segmentHeight;
      const w = segmentWidth * (1 + MODERN_CONFIG.segments.overlap);
      const h = segmentHeight * (1 + MODERN_CONFIG.segments.overlap);

      // Create segment path with configurable randomness
      const distortion = segmentWidth * MODERN_CONFIG.segments.randomness;
      const points = [
        [x + Math.random() * distortion, y + Math.random() * distortion],
        [x + w - Math.random() * distortion, y + Math.random() * distortion],
        [x + w - Math.random() * distortion, y + h - Math.random() * distortion],
        [x + Math.random() * distortion, y + h - Math.random() * distortion],
      ];

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.forEach((point) => ctx.lineTo(point[0], point[1]));
      ctx.closePath();
      ctx.clip();

      // Process segment image
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(img, i * (img.width / MODERN_CONFIG.segments.count), j * (img.height / MODERN_CONFIG.segments.count), (img.width / MODERN_CONFIG.segments.count) * (1 + MODERN_CONFIG.segments.overlap), (img.height / MODERN_CONFIG.segments.count) * (1 + MODERN_CONFIG.segments.overlap), 0, 0, w, h);

      const imageData = tempCtx.getImageData(0, 0, w, h);
      const enhancedData = enhanceContrast(imageData);
      tempCtx.putImageData(enhancedData, 0, 0);

      // Apply segment rotation
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate((Math.random() - 0.5) * MODERN_CONFIG.segments.rotationMax);
      ctx.translate(-(x + w / 2), -(y + h / 2));

      ctx.drawImage(tempCanvas, x, y, w, h);

      // Draw borders
      ctx.strokeStyle = `rgba(0, 0, 0, ${MODERN_CONFIG.style.borderOpacity})`;
      ctx.lineWidth = Math.min(width, height) * MODERN_CONFIG.style.borderWidth;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Add bold accent lines
  ctx.lineWidth = Math.min(width, height) * MODERN_CONFIG.style.boldLineWidth;
  ctx.strokeStyle = `rgba(0, 0, 0, ${MODERN_CONFIG.style.borderOpacity + 0.05})`;

  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    const x = width * (0.2 + Math.random() * 0.6);
    const y = height * (0.2 + Math.random() * 0.6);
    const length = Math.min(width, height) * (0.2 + Math.random() * 0.3);
    const angle = (Math.round(Math.random() * 4) * Math.PI) / 2;

    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  // Apply canvas texture
  const textureCanvas = createCanvasTexture(ctx, width, height);
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  // Add vignette
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, `rgba(0,0,0,${MODERN_CONFIG.texture.vignetteStrength})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};
