// src/components/ImageArea/ImageArea.tsx
import React, { useEffect, useRef, useCallback } from "react";
import { Upload, Download, Undo, Redo, Trash2, FolderOpen, Link } from "lucide-react";
import { useEditor } from "../../contexts/EditorContext";
import { Button } from "@/components/ui/button";
import FileBrowserDialog from "../FileBrowser/FileBrowserDialog";
import URLInputDialog from "../URLInput/URLInputDialog";
import { applyCubismEffect } from "@/lib/effects/cubism";
import { applyPointillismEffect } from "@/lib/effects/pointillism";
import { applyModernEffect } from "@/lib/effects/modern";
import { applyAbstractEffect } from "@/lib/effects/abstract";
import { applyRasterEffect } from "@/lib/effects/raster";
import type { ArtEffect } from "@/lib/effects/types";

const DEBOUNCE_DELAY = 300;

const ImageArea: React.FC = () => {
  const { state, dispatch, canUndo, canRedo } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeoutRef = useRef<number>();
  const lastImageRef = useRef<HTMLImageElement>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ type: "SET_IMAGE", payload: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    dispatch({ type: "SET_IMAGE", payload: null });
    dispatch({ type: "RESET_FILTERS" });
  };

  const applyEffects = async (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;

    // Create a temporary canvas for base filters
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) return;

    // Apply base adjustments
    tempCtx.filter = `
      brightness(${100 + state.filterSettings.brightness}%)
      contrast(${100 + state.filterSettings.contrast}%)
      saturate(${100 + state.filterSettings.saturation}%)
    `;

    tempCtx.drawImage(img, 0, 0, width, height);

    // Create intermediate image with base filters
    const filteredImg = new Image();
    await new Promise((resolve) => {
      filteredImg.onload = resolve;
      filteredImg.src = tempCanvas.toDataURL();
    });

    // Clear main canvas
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";

    // Apply art style if selected
    const effectMap: Record<string, ArtEffect> = {
      cubism: applyCubismEffect,
      pointillism: applyPointillismEffect,
      modern: applyModernEffect,
      abstract: applyAbstractEffect,
    };

    if (state.filterSettings.artStyle !== "none") {
      const selectedEffect = effectMap[state.filterSettings.artStyle];
      if (selectedEffect) {
        selectedEffect(ctx, filteredImg, width, height);

        // If we also have a raster effect, we need another intermediate canvas
        if (state.filterSettings.rasterStyle !== "none") {
          const artStyleCanvas = document.createElement("canvas");
          artStyleCanvas.width = width;
          artStyleCanvas.height = height;
          const artStyleCtx = artStyleCanvas.getContext("2d");
          if (artStyleCtx) {
            artStyleCtx.drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const artStyleImg = new Image();
            await new Promise((resolve) => {
              artStyleImg.onload = resolve;
              artStyleImg.src = artStyleCanvas.toDataURL();
            });

            // Apply raster effect on top of art style
            applyRasterEffect(ctx, artStyleImg, width, height, state.filterSettings.rasterStyle, {
              granularity: state.filterSettings.rasterGranularity,
              randomness: state.filterSettings.rasterRandomness,
            });
          }
        }
      }
    } else if (state.filterSettings.rasterStyle !== "none") {
      // Apply only raster effect if no art style is selected
      applyRasterEffect(ctx, filteredImg, width, height, state.filterSettings.rasterStyle, {
        granularity: state.filterSettings.rasterGranularity,
        randomness: state.filterSettings.rasterRandomness,
      });
    } else {
      // No effects, just draw the filtered image
      ctx.drawImage(filteredImg, 0, 0);
    }
  };
  const debouncedApplyEffects = useCallback(() => {
    if (!state.image || !canvasRef.current || !lastImageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear any pending timeouts
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = window.setTimeout(() => {
      applyEffects(ctx, lastImageRef.current!, canvas);
    }, DEBOUNCE_DELAY);
  }, [state.filterSettings]);

  // Initial image load
  useEffect(() => {
    if (!state.image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      lastImageRef.current = img; // Store the image reference
      applyEffects(ctx, img, canvas);
    };
    img.src = state.image;
  }, [state.image]);

  // Effect changes
  useEffect(() => {
    debouncedApplyEffects();

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [state.filterSettings, debouncedApplyEffects]);

  return (
    <div className="h-full w-full p-4 shadow-inner bg-muted/60">
      <div className={`h-full w-full flex items-center justify-center ${!state.image ? "border-2 border-dashed border-border" : ""} rounded-lg relative`}>
        {!state.image ? (
          <div className="text-center space-y-6">
            <div className="flex flex-col gap-4 items-center mx-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col border-2 items-center gap-2 p-4 rounded-lg hover:bg-background">
                <Upload className="w-8 h-8" />
                <span className="text-sm font-mono">Upload image</span>
              </button>

              <div className="md:flex space-y-4 md:space-y-0 gap-2">
                <FileBrowserDialog>
                  <Button
                    variant="outline"
                    
                    className="gap-2 w-full">
                    <FolderOpen className="w-4 h-4" />
                    Browse Files
                  </Button>
                </FileBrowserDialog>

                <URLInputDialog>
                  <Button
                    variant="outline"
                    
                    className="gap-2 w-full">
                    <Link className="w-4 h-4" />
                    From URL
                  </Button>
                </URLInputDialog>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative w-full h-full md:flex md:items-center justify-center">
            <div className="md:absolute w-auto -mt-4 mb-4 md:mb-0 top-2 -left-2 -right-2 flex gap-0 p-2 justify-between bg-background z-20 md:rounded-lg rounded-b-lg shadow-sm backdrop-saturate-50 border">
              <section className="absolute inset-0 md:bg-gradient-to-b from-muted/10 shadow-inner md:shadow-none to-transparent"></section>
              <div className="flex items-center gap-2 pr-4 mr-4 border-r">
                <Button
                  variant="outline"
                  
                  onClick={() => dispatch({ type: "UNDO" })}
                  disabled={!canUndo}
                  className="flex items-center gap-2 px-2 text-xs">
                  <Undo className="w-4 h-4" />
                  <span className="sr-only">Undo</span>
                </Button>
                <Button
                  variant="outline"
                  
                  onClick={() => dispatch({ type: "REDO" })}
                  disabled={!canRedo}
                  className="flex items-center gap-2 px-2">
                  <Redo className="w-4 h-4" />
                  <span className="sr-only">Redo</span>
                </Button>
              </div>
              <Button
                variant="destructive"
                
                onClick={handleDeleteImage}
                className="flex items-center gap-2 px-2">
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain shadow-lg border border-border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageArea;
