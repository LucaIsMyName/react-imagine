import { ArtEffect } from './types';

const CUBISM_CONFIG = {
  // Core settings
  randomness: {
    position: 1,      // 0: perfect grid, 1: completely random positions
    rotation: 0.3,      // 0: aligned shapes, 1: random rotations
    size: 1,        // 0: uniform size, 1: random sizes
    color: 1         // 0: exact colors, 1: random variations
  },

  // Shape properties
  shapes: {
    borderWidth:0,       // Width of shape borders in pixels
    borderOpacity:0,     // 0-1: opacity of borders
    minSize: 20,           // Minimum shape size in pixels
    maxSize: 60,           // Maximum shape size in pixels
    overlap: 0,            // Pixels of overlap between shapes to prevent gaps
  },
  
  // Detail level
  granularity: {
    base: 40,              // Base size for grid squares (lower = more shapes)
    featureMultiplier: 1 // Multiply base size for feature areas (< 1 means more detail)
  },

  // Shape generation
  shapeTypes: {
    primary: ['square', 'triangle'] as const,
    secondary: ['triangle', 'diamond'] as const, // Shapes used to fill gaps
    feature: ['square'] as const,               // Shapes used for detected features
  },

  // Color processing
  colors: {
    quantization: 32,      // Color reduction level (higher = more similar colors grouped)
    saturation: 1.2,       // Color saturation multiplier
    contrast: 1.1,         // Contrast adjustment
  },

  // Feature detection
  features: {
    blobThreshold: 200,    // Color difference threshold for blob detection
    minBlobSize: 50,       // Minimum pixels for a blob to be considered
    edgeThreshold: 30,     // Edge detection sensitivity
    neighborRadius: 0     // Radius for checking neighboring pixels
  }
} as const;

interface Shape {
  type: typeof CUBISM_CONFIG.shapeTypes.primary[number] | 
        typeof CUBISM_CONFIG.shapeTypes.secondary[number];
  x: number;
  y: number;
  width: number;
  height: number;
  color: { r: number; g: number; b: number };
  rotation: number;
  isFeature?: boolean;
}

// Function to ensure complete coverage by adding complementary shapes
const addComplementaryShape = (
  mainShape: Shape, 
  ctx: CanvasRenderingContext2D
): Shape => {
  const angle = mainShape.rotation;
  let complementType: Shape['type'];
  
  // Choose complementary shape based on main shape and angle
  if (mainShape.type === 'triangle') {
    complementType = Math.abs(angle % Math.PI) < 0.1 ? 'triangle' : 'diamond';
  } else {
    complementType = 'triangle';
  }

  return {
    type: complementType,
    x: mainShape.x + Math.cos(angle) * mainShape.width * 0.5,
    y: mainShape.y + Math.sin(angle) * mainShape.height * 0.5,
    width: mainShape.width * 0.8,
    height: mainShape.height * 0.8,
    color: mainShape.color,
    rotation: angle + Math.PI,
  };
};

// Draw a single shape with its complementary shape if needed
const drawShapeWithComplement = (
  shape: Shape,
  ctx: CanvasRenderingContext2D
) => {
  const drawSingleShape = (s: Shape) => {
    ctx.save();
    ctx.translate(s.x + s.width/2, s.y + s.height/2);
    ctx.rotate(s.rotation);
    ctx.translate(-(s.x + s.width/2), -(s.y + s.height/2));

    ctx.beginPath();
    switch (s.type) {
      case 'square':
        ctx.rect(s.x - CUBISM_CONFIG.shapes.overlap, 
                s.y - CUBISM_CONFIG.shapes.overlap, 
                s.width + CUBISM_CONFIG.shapes.overlap * 2, 
                s.height + CUBISM_CONFIG.shapes.overlap * 2);
        break;
      case 'triangle':
        const h = s.height * Math.sqrt(3) / 2;
        ctx.moveTo(s.x + s.width/2, s.y);
        ctx.lineTo(s.x + s.width, s.y + h);
        ctx.lineTo(s.x, s.y + h);
        break;
      case 'diamond':
        ctx.moveTo(s.x + s.width/2, s.y);
        ctx.lineTo(s.x + s.width, s.y + s.height/2);
        ctx.lineTo(s.x + s.width/2, s.y + s.height);
        ctx.lineTo(s.x, s.y + s.height/2);
        break;
    }
    ctx.closePath();

    // Fill
    ctx.fillStyle = `rgb(${s.color.r},${s.color.g},${s.color.b})`;
    ctx.fill();

    // Border
    ctx.strokeStyle = `rgba(0,0,0,${CUBISM_CONFIG.shapes.borderOpacity})`;
    ctx.lineWidth = CUBISM_CONFIG.shapes.borderWidth;
    ctx.stroke();

    ctx.restore();
  };

  // Draw main shape
  drawSingleShape(shape);

  // Add complementary shape if needed (for triangles or specific angles)
  if (shape.type === 'triangle' || Math.abs(shape.rotation % (Math.PI/2)) > 0.1) {
    const complement = addComplementaryShape(shape, ctx);
    drawSingleShape(complement);
  }
};

export const applyCubismEffect: ArtEffect = (ctx, img, width, height) => {
  // Create temporary canvas for analysis
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Draw and get image data for analysis
  tempCtx.drawImage(img, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);

  // Function to detect significant blobs (berries in this case)
  const detectBlobs = () => {
    const blobs: Shape[] = [];
    const visited = new Set<string>();
    const blueThreshold = 150; // Threshold for detecting blue berries
    
    for (let y = 0; y < height; y += 5) { // Step by 5 for performance
      for (let x = 0; x < width; x += 5) {
        const i = (y * width + x) * 4;
        const key = `${x},${y}`;
        
        if (!visited.has(key) && 
            imageData.data[i + 2] > blueThreshold && // Blue channel
            imageData.data[i] < 150) { // Red channel (to ensure it's blue)
          
          // Flood fill to find blob size and average color
          let sumX = 0, sumY = 0, count = 0;
          let sumR = 0, sumG = 0, sumB = 0;
          const stack = [[x, y]];
          
          while (stack.length) {
            const [px, py] = stack.pop()!;
            const pkey = `${px},${py}`;
            
            if (visited.has(pkey)) continue;
            visited.add(pkey);
            
            const idx = (py * width + px) * 4;
            if (imageData.data[idx + 2] > blueThreshold && px >= 0 && px < width && py >= 0 && py < height) {
              sumX += px;
              sumY += py;
              sumR += imageData.data[idx];
              sumG += imageData.data[idx + 1];
              sumB += imageData.data[idx + 2];
              count++;
              
              stack.push([px + 5, py], [px - 5, py], [px, py + 5], [px, py - 5]);
            }
          }
          
          if (count > 50) { // Minimum blob size
            blobs.push({
              type: 'square',
              x: sumX / count,
              y: sumY / count,
              size: Math.sqrt(count) * 1.5, // Adjust size based on blob area
              color: {
                r: sumR / count,
                g: sumG / count,
                b: sumB / count
              }
            });
          }
        }
      }
    }
    return blobs;
  };

  // Function to create background grid of alternating squares and triangles
  const createBackgroundGrid = () => {
    const shapes: Shape[] = [];
    const gridSize = 30; // Base size for background shapes
    
    for (let y = 0; y < height; y += gridSize) {
      for (let x = 0; x < width; x += gridSize) {
        const i = (y * width + x) * 4;
        shapes.push({
          type: (x + y) % (gridSize * 2) === 0 ? 'square' : 'triangle',
          x,
          y,
          size: gridSize,
          color: {
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2]
          },
          rotation: Math.floor((x + y) / gridSize) % 4 * Math.PI / 2
        });
      }
    }
    return shapes;
  };

  // Draw a shape with perfect alignment
  const drawShape = (shape: Shape) => {
    ctx.save();
    ctx.translate(shape.x + shape.size/2, shape.y + shape.size/2);
    if (shape.rotation) {
      ctx.rotate(shape.rotation);
    }
    ctx.translate(-(shape.x + shape.size/2), -(shape.y + shape.size/2));

    ctx.beginPath();
    if (shape.type === 'square') {
      ctx.rect(shape.x, shape.y, shape.size, shape.size);
    } else {
      // Equilateral triangle
      const h = shape.size * Math.sqrt(3) / 2;
      ctx.moveTo(shape.x + shape.size/2, shape.y);
      ctx.lineTo(shape.x + shape.size, shape.y + h);
      ctx.lineTo(shape.x, shape.y + h);
    }
    ctx.closePath();

    // Fill with color
    ctx.fillStyle = `rgb(${shape.color.r},${shape.color.g},${shape.color.b})`;
    ctx.fill();

    // Add border
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  };

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background grid first
  const backgroundShapes = createBackgroundGrid();
  backgroundShapes.forEach(drawShape);

  // Detect and draw berries as squares
  const berries = detectBlobs();
  berries.forEach(drawShape);

  // Add final border lines for definition
  backgroundShapes.forEach(shape => {
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 0.5;
    if (shape.type === 'square') {
      ctx.strokeRect(shape.x, shape.y, shape.size, shape.size);
    }
  });
};