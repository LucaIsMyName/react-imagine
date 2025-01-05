// src/components/ImageArea/ImageArea.tsx
import React, { useEffect, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { applyCubismEffect } from '@/lib/effects/cubism';
import { applyPointillismEffect } from '@/lib/effects/pointillism';
import { applyModernEffect } from '@/lib/effects/modern';
import { applyAbstractEffect } from '@/lib/effects/abstract';
import type { ArtEffect } from '@/lib/effects/types';

const ImageArea: React.FC = () => {
  const { state, dispatch } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ type: 'SET_IMAGE', payload: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    dispatch({ type: 'SET_IMAGE', payload: null });
    dispatch({ type: 'RESET_FILTERS' });
  };

  const applyEffects = async (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
  ) => {
    const { width, height } = canvas;
    
    // Create a temporary canvas for base filters
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;

    // Apply base adjustments
    tempCtx.filter = `
      brightness(${100 + state.filterSettings.brightness}%)
      contrast(${100 + state.filterSettings.contrast}%)
      saturate(${100 + state.filterSettings.saturation}%)
    `;
    
    tempCtx.drawImage(img, 0, 0, width, height);

    // Create a new image with the base filters applied
    const filteredImg = new Image();
    await new Promise((resolve) => {
      filteredImg.onload = resolve;
      filteredImg.src = tempCanvas.toDataURL();
    });

    // Clear main canvas and reset any previous settings
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    
    // Apply art style if selected
    const effectMap: Record<string, ArtEffect> = {
      cubism: applyCubismEffect,
      pointillism: applyPointillismEffect,
      modern: applyModernEffect,
      abstract: applyAbstractEffect,
    };

    const selectedEffect = effectMap[state.filterSettings.artStyle];
    if (selectedEffect) {
      selectedEffect(ctx, filteredImg, width, height);
    } else {
      ctx.drawImage(filteredImg, 0, 0);
    }
  };

  useEffect(() => {
    if (!state.image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyEffects(ctx, img, canvas);
    };
    img.src = state.image;
  }, [state.image, state.filterSettings]);

  return (
    <div className="h-full w-full p-4 shadow-inner">
      <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg relative">
        {!state.image ? (
          <div className="text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-6 rounded-lg hover:bg-accent"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm">Click to upload an image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 z-10 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Image</span>
            </Button>
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageArea;