import { applyCubismEffect } from "../effects/cubism";
import { applyPointillismEffect } from "../effects/pointillism";
import { applyModernEffect } from "../effects/modern";
import { applyAbstractEffect } from "../effects/abstract";
import { applyRasterEffect } from "../effects/raster";
import type { FilterSettings } from "@/types/editor-types";

const resetCanvasContext = (ctx: CanvasRenderingContext2D) => {
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
};

export async function createProcessedCanvas(originalImage: string, filterSettings: FilterSettings, targetWidth?: number, targetHeight?: number): Promise<HTMLCanvasElement> {
  // Create new image from source
  const img = new Image();
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = originalImage;
  });

  // Calculate dimensions
  const width = targetWidth || img.width;
  const height = targetHeight || (targetWidth ? (img.height * targetWidth) / img.width : img.height);

  // Create main canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Always start with a clean state
  resetCanvasContext(ctx);

  // Apply base filters
  ctx.filter = `
    brightness(${100 + filterSettings.brightness}%)
    contrast(${100 + filterSettings.contrast}%)
    saturate(${100 + filterSettings.saturation}%)
  `;

  // Draw initial image
  ctx.drawImage(img, 0, 0, width, height);

  // If no effects are applied, we can return early
  if (filterSettings.artStyle === "none" && filterSettings.rasterStyle === "none") {
    return canvas;
  }

  // Create a temporary canvas for effects
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");

  if (!tempCtx) throw new Error("Could not get temp canvas context");

  // Copy the base filtered image to temp canvas
  tempCtx.drawImage(canvas, 0, 0);

  // Clear the original canvas and reset its state
  ctx.clearRect(0, 0, width, height);
  resetCanvasContext(ctx);

  // Apply art style effects if selected
  if (filterSettings.artStyle !== "none") {
    const effectMap = {
      cubism: applyCubismEffect,
      pointillism: applyPointillismEffect,
      modern: applyModernEffect,
      abstract: applyAbstractEffect,
    };

    const selectedEffect = effectMap[filterSettings.artStyle as keyof typeof effectMap];
    if (selectedEffect) {
      selectedEffect(ctx, tempCanvas, width, height, {
        granularity: filterSettings.artGranularity,
        randomness: filterSettings.artRandomness,
      });
    } else {
      // If no effect applied, copy back the filtered image
      ctx.drawImage(tempCanvas, 0, 0);
    }
  } else {
    // No art style, copy back the filtered image
    ctx.drawImage(tempCanvas, 0, 0);
  }

  // Apply raster effects if selected
  if (filterSettings.rasterStyle !== "none") {
    // Create a new temp canvas for raster effect
    const rasterCanvas = document.createElement("canvas");
    rasterCanvas.width = width;
    rasterCanvas.height = height;
    const rasterCtx = rasterCanvas.getContext("2d");

    if (!rasterCtx) throw new Error("Could not get raster canvas context");

    // Copy current state to raster canvas
    rasterCtx.drawImage(canvas, 0, 0);

    // Clear main canvas and reset its state
    ctx.clearRect(0, 0, width, height);
    resetCanvasContext(ctx);

    // Apply raster effect
    applyRasterEffect(ctx, rasterCanvas, width, height, filterSettings.rasterStyle as "dots" | "lines-horizontal" | "lines-vertical", {
      granularity: filterSettings.rasterGranularity,
      randomness: filterSettings.rasterRandomness,
    });
  }

  // Final reset of canvas state
  resetCanvasContext(ctx);

  return canvas;
}
