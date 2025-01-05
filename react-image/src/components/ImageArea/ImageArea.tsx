// src/components/ImageArea/ImageArea.tsx
import React, { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';

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

  const applyCubismEffect = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number
  ) => {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the original image first
    ctx.drawImage(img, 0, 0, width, height);

    // Parameters for the cubism effect
    const minSize = 30;
    const maxSize = 60;
    const numShapes = 100;  // Number of geometric shapes to create

    // Create multiple geometric shapes
    for (let i = 0; i < numShapes; i++) {
      // Random position and size
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = minSize + Math.random() * (maxSize - minSize);

      // Save the current state
      ctx.save();

      // Create a clipping path (triangle or polygon)
      ctx.beginPath();
      if (Math.random() > 0.5) {
        // Triangle
        ctx.moveTo(x, y);
        ctx.lineTo(x + size * Math.cos(Math.PI / 3), y + size * Math.sin(Math.PI / 3));
        ctx.lineTo(x - size * Math.cos(Math.PI / 3), y + size * Math.sin(Math.PI / 3));
      } else {
        // Polygon
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

      // Slight offset for the image inside the shape
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      // Draw the image with a slight offset
      ctx.drawImage(img, offsetX, offsetY, width, height);

      // Restore the canvas state
      ctx.restore();
    }

    // Add some edge definition
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < numShapes; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = minSize + Math.random() * (maxSize - minSize);

      ctx.beginPath();
      if (Math.random() > 0.5) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size * Math.cos(Math.PI / 3), y + size * Math.sin(Math.PI / 3));
        ctx.lineTo(x - size * Math.cos(Math.PI / 3), y + size * Math.sin(Math.PI / 3));
      }
      ctx.closePath();
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (!state.image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply base filters using CSS filter
      ctx.filter = `
        brightness(${100 + state.filterSettings.brightness}%)
        contrast(${100 + state.filterSettings.contrast}%)
        saturate(${100 + state.filterSettings.saturation}%)
      `;

      // Apply art style if selected
      if (state.filterSettings.artStyle === 'cubism') {
        applyCubismEffect(ctx, img, canvas.width, canvas.height);
      } else {
        // Just draw the image normally with filters
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = state.image;
  }, [state.image, state.filterSettings]);

  return (
    <div className="h-full w-full p-4 shadow-inner">
      <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg">
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