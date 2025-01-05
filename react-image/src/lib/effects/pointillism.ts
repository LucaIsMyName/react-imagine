// src/lib/effects/pointillism.ts
import { ArtEffect } from './types';

const POINTILLISM_CONFIG = {
  // Base settings
  background: {
    color: '#FFFDF5',
    opacity: 0.9,
  },

  // Dot configuration
  dots: {
    minSize: 0.007,
    maxSize: 0.01,
    density: 0.6,
    rotation: 0.7,
  },

  // Color settings
  color: {
    saturation: 1.2,
    variance: 10,
    brightness: {
      min: 0.7,
      max: 1.1
    },
    complementary: {
      frequency: 0.2,
      shift: 30
    }
  },

  // Brush settings
  brush: {
    randomness: 1,
    elongation: 0.4,
    angleVariance: 1,
    pressure: {
      min: 0.7,
      max: 1.0
    },
    edges: {
      roughness: 0.3,
      points: 8
    }
  },

  // Multi-pass settings
  passes: {
    base: {
      size: 1,
      spacing: 2,
      opacity: 0.8
    },
    detail: {
      size: 0.5,
      spacing: 1,
      opacity: 0.6
    },
    highlight: {
      threshold: 600,
      density: 10000,
      opacity: 0.7
    }
  }
};

export const applyPointillismEffect: ArtEffect = (ctx, img, width, height) => {
  const adjustColor = (r: number, g: number, b: number) => {
    const { saturation, variance, brightness } = POINTILLISM_CONFIG.color;
    
    const avg = (r + g + b) / 3;
    const adjustedR = avg + (r - avg) * saturation;
    const adjustedG = avg + (g - avg) * saturation;
    const adjustedB = avg + (b - avg) * saturation;

    const brightnessMultiplier = brightness.min + Math.random() * (brightness.max - brightness.min);

    return {
      regular: `rgba(
        ${Math.round(adjustedR * brightnessMultiplier)},
        ${Math.round(adjustedG * brightnessMultiplier)},
        ${Math.round(adjustedB * brightnessMultiplier)},
        ${POINTILLISM_CONFIG.passes.base.opacity}
      )`,
      complementary: `rgba(
        ${Math.round(adjustedB * brightnessMultiplier)},
        ${Math.round(adjustedR * brightnessMultiplier)},
        ${Math.round(adjustedG * brightnessMultiplier)},
        ${POINTILLISM_CONFIG.passes.detail.opacity}
      )`
    };
  };

  const drawBrushStroke = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const { randomness, elongation, angleVariance, edges } = POINTILLISM_CONFIG.brush;
    
    const baseAngle = Math.random() * Math.PI * 2 * angleVariance;
    const width = size * (1 + Math.random() * elongation);
    const height = size * (1 - Math.random() * elongation * 0.5);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(baseAngle);
    
    ctx.beginPath();
    
    for (let i = 0; i <= edges.points; i++) {
      const angle = (i / edges.points) * Math.PI * 2;
      const radius = i === edges.points ? width / 2 :
        (width / 2) * (1 + (Math.random() - 0.5) * randomness);
      
      const radiusVariation = 1 + (Math.random() - 0.5) * edges.roughness;
      const currentRadius = radius * radiusVariation;
      
      const px = Math.cos(angle) * currentRadius;
      const py = Math.sin(angle) * currentRadius * (height / width);
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        const prevAngle = ((i - 1) / edges.points) * Math.PI * 2;
        const cpRadius = radius * (1 + (Math.random() - 0.5) * randomness * 0.5);
        const cpx = Math.cos(prevAngle + (angle - prevAngle) / 2) * cpRadius;
        const cpy = Math.sin(prevAngle + (angle - prevAngle) / 2) * cpRadius * (height / width);
        
        ctx.quadraticCurveTo(cpx, cpy, px, py);
      }
    }
    
    ctx.closePath();
    ctx.restore();
  };

  const renderDots = (spacing: number, dotSize: number, pass: 'base' | 'detail') => {
    const rotationFactor = POINTILLISM_CONFIG.dots.rotation * spacing;
    
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const offsetX = (Math.random() - 0.5) * rotationFactor;
        const offsetY = (Math.random() - 0.5) * rotationFactor;
        
        const sampleX = Math.floor(x + offsetX);
        const sampleY = Math.floor(y + offsetY);
        
        if (sampleX < 0 || sampleX >= width || sampleY < 0 || sampleY >= height) continue;
        
        const i = (sampleY * width + sampleX) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        
        if (pass === 'detail' && r + g + b < 100) continue;
        
        const colors = adjustColor(r, g, b);
        drawBrushStroke(ctx, x + offsetX, y + offsetY, dotSize * (0.7 + Math.random() * 0.3));
        
        const pressure = POINTILLISM_CONFIG.brush.pressure.min + 
          Math.random() * (POINTILLISM_CONFIG.brush.pressure.max - POINTILLISM_CONFIG.brush.pressure.min);
          
        ctx.fillStyle = Math.random() < POINTILLISM_CONFIG.color.complementary.frequency
          ? colors.complementary
          : colors.regular;
          
        ctx.globalAlpha = pressure;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  };

  // Start the effect application
  ctx.clearRect(0, 0, width, height);
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.drawImage(img, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  
  ctx.fillStyle = POINTILLISM_CONFIG.background.color;
  ctx.globalAlpha = POINTILLISM_CONFIG.background.opacity;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  
  const minDimension = Math.min(width, height);
  const minDotSize = minDimension * POINTILLISM_CONFIG.dots.minSize;
  const maxDotSize = minDimension * POINTILLISM_CONFIG.dots.maxSize;
  const baseSpacing = minDotSize * POINTILLISM_CONFIG.dots.density;
  
  renderDots(
    baseSpacing * POINTILLISM_CONFIG.passes.base.spacing,
    maxDotSize * POINTILLISM_CONFIG.passes.base.size,
    'base'
  );
  
  renderDots(
    baseSpacing * POINTILLISM_CONFIG.passes.detail.spacing,
    minDotSize * POINTILLISM_CONFIG.passes.detail.size,
    'detail'
  );

  // Highlights
  const numHighlights = (width * height) / POINTILLISM_CONFIG.passes.highlight.density;
  ctx.globalAlpha = POINTILLISM_CONFIG.passes.highlight.opacity;
  
  for (let i = 0; i < numHighlights; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
    
    const sum = imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2];
    if (sum > POINTILLISM_CONFIG.passes.highlight.threshold) {
      drawBrushStroke(ctx, x, y, minDotSize);
      ctx.fillStyle = 'rgb(255, 255, 250)';
      ctx.fill();
    }
  }
  
  ctx.globalAlpha = 1;
};