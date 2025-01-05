// src/lib/utils/canvas.ts
import { applyCubismEffect } from '../effects/cubism';
import { applyPointillismEffect } from '../effects/pointillism';
import { applyModernEffect } from '../effects/modern';
import { applyAbstractEffect } from '../effects/abstract';
import type { FilterSettings } from '@/types/editor-types';

export async function createProcessedCanvas(
  originalImage: string,
  filterSettings: FilterSettings,
  targetWidth?: number,
  targetHeight?: number
): Promise<HTMLCanvasElement> {
  // Create new image from source
  const img = new Image();
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = originalImage;
  });

  // Calculate dimensions
  const width = targetWidth || img.width;
  const height = targetHeight || (targetWidth ? (img.height * targetWidth / img.width) : img.height);

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Apply base filters
  ctx.filter = `
    brightness(${100 + filterSettings.brightness}%)
    contrast(${100 + filterSettings.contrast}%)
    saturate(${100 + filterSettings.saturation}%)
  `;
  
  ctx.drawImage(img, 0, 0, width, height);

  // If we have an art style, we need to process it through a temporary canvas
  if (filterSettings.artStyle !== 'none') {
    const effectMap = {
      cubism: applyCubismEffect,
      pointillism: applyPointillismEffect,
      modern: applyModernEffect,
      abstract: applyAbstractEffect,
    };

    // Create a new canvas with the base filters
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) throw new Error('Could not get temp canvas context');

    // Clear the original canvas
    ctx.clearRect(0, 0, width, height);
    ctx.filter = 'none'; // Reset filters for art effect

    // Apply art effect
    const selectedEffect = effectMap[filterSettings.artStyle as keyof typeof effectMap];
    if (selectedEffect) {
      selectedEffect(ctx, img, width, height);
    }
  }

  return canvas;
}