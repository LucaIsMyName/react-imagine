// src/lib/effects/cubism.ts
import { ArtEffect } from "./types";

interface Point {
  x: number;
  y: number;
}

interface ColorRegion {
  color: { r: number; g: number; b: number };
  points: Point[];
  weight: number; // Significance of this region
}

interface Shape {
  points: Point[];
  color: { r: number; g: number; b: number };
  neighbors: number[]; // IDs of adjacent shapes
  id: number;
}
const colorDistance = (c1: {r:number,g:number,b:number}, c2: {r:number,g:number,b:number}) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) + 
    Math.pow(c1.g - c2.g, 2) + 
    Math.pow(c1.b - c2.b, 2)
  );
};

// Helper to get color at pixel
const getColor = (imageData: ImageData, x: number, y: number) => {
  const i = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[i],
    g: imageData.data[i + 1],
    b: imageData.data[i + 2]
  };
};
const getCubismConfig = (granularity: number, randomness: number) => ({
  colorAnalysis: {
    // Number of distinct colors to detect
    colorCount: Math.max(5, Math.floor(15 * (granularity / 100))),
    // Minimum region size as percentage of image
    minRegionSize: 0.01 * (1 - granularity / 100),
    // Color similarity threshold
    colorThreshold: 30 * (randomness / 100),
  },

  shapes: {
    // Minimum angle between edges
    minAngle: 30 * (1 - randomness / 100),
    // Maximum shape size relative to image
    maxSize: 0.2 * (1 - granularity / 100),
    // Edge alignment tolerance
    alignmentTolerance: 2 + randomness / 25,
  },

  style: {
    borderWidth: 1,
    borderOpacity: 0.8,
    shadeVariation: randomness / 200,
  },
});

// Find significant color regions using color quantization and connected components
const findColorRegions = (imageData: ImageData, config: ReturnType<typeof getCubismConfig>): ColorRegion[] => {
  const { width, height } = imageData;
  const regions: ColorRegion[] = [];
  const visited = new Set<number>();

  // Flood fill to find connected regions
  const floodFill = (startX: number, startY: number) => {
    const startColor = getColor(imageData, startX, startY);
    const points: Point[] = [];
    const stack: Point[] = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const {x, y} = stack.pop()!;
      const idx = y * width + x;
      
      if (visited.has(idx)) continue;
      visited.add(idx);

      const currentColor = getColor(imageData, x, y);
      if (colorDistance(currentColor, startColor) > config.colorAnalysis.colorThreshold) {
        continue;
      }

      points.push({x, y});

      // Add neighbors
      const neighbors = [
        {x: x+1, y}, {x: x-1, y},
        {x, y: y+1}, {x, y: y-1}
      ];

      for (const {x: nx, y: ny} of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          if (!visited.has(nidx)) {
            stack.push({x: nx, y: ny});
          }
        }
      }
    }

    return {
      points,
      color: startColor,
      weight: points.length / (width * height)
    };
  };

  // Find all significant regions
  for (let y = 0; y < height; y += 5) {
    for (let x = 0; x < width; x += 5) {
      const idx = y * width + x;
      if (!visited.has(idx)) {
        const region = floodFill(x, y);
        if (region.weight >= config.colorAnalysis.minRegionSize) {
          regions.push(region);
        }
      }
    }
  }

  // Merge similar regions
  return mergeRegions(regions, config);
};

// Merge similar color regions
const mergeRegions = (regions: ColorRegion[], config: ReturnType<typeof getCubismConfig>) => {
  if (regions.length === 0) {
    console.log("No regions found in initial pass");
    return [];
  }

  const merged: ColorRegion[] = [];
  const threshold = config.colorAnalysis.colorThreshold;

  // Ensure we have at least some regions
  const minRegionCount = 5;
  if (regions.length < minRegionCount) {
    console.log("Too few regions, lowering threshold");
    regions.sort((a, b) => b.weight - a.weight);
    return regions;
  }

  // Regular merging logic...
  for (const region of regions) {
    let foundMatch = false;
    for (const target of merged) {
      const colorDist = colorDistance(region.color, target.color);
      if (colorDist < threshold) {
        target.points.push(...region.points);
        target.weight += region.weight;
        // Average the colors for smoother transitions
        target.color = {
          r: Math.round((target.color.r + region.color.r) / 2),
          g: Math.round((target.color.g + region.color.g) / 2),
          b: Math.round((target.color.b + region.color.b) / 2)
        };
        foundMatch = true;
        break;
      }
    }
    if (!foundMatch) {
      merged.push(region);
    }
  }

  return merged.sort((a, b) => b.weight - a.weight)
    .slice(0, config.colorAnalysis.colorCount);
};

// Create triangulated shapes from region boundaries
const createAlignedShapes = (regions: ColorRegion[], width: number, height: number, config: ReturnType<typeof getCubismConfig>): Shape[] => {
  const shapes: Shape[] = [];
  const edges = new Set<string>();

  // Find edges between different regions
  regions.forEach((region, regionIdx) => {
    const boundary = findBoundaryPoints(region.points, width, height);
    const simplified = simplifyPolygon(boundary, config.shapes.minAngle);

    // Create shapes from simplified boundary
    for (let i = 0; i < simplified.length - 2; i++) {
      const shape: Shape = {
        points: [simplified[i], simplified[i + 1], simplified[i + 2]],
        color: region.color,
        neighbors: [],
        id: shapes.length,
      };
      shapes.push(shape);

      // Add edges
      for (let j = 0; j < 3; j++) {
        const p1 = shape.points[j];
        const p2 = shape.points[(j + 1) % 3];
        edges.add(edgeKey(p1, p2));
      }
    }
  });

  // Align shapes along shared edges
  alignShapes(shapes, edges, config);

  return shapes;
};


// Create unique key for an edge
const edgeKey = (p1: Point, p2: Point) => {
  return `${Math.min(p1.x, p2.x)},${Math.min(p1.y, p2.y)}_${Math.max(p1.x, p2.x)},${Math.max(p1.y, p2.y)}`;
};

// Align shapes along shared edges
const alignShapes = (shapes: Shape[], edges: Set<string>, config: ReturnType<typeof getCubismConfig>) => {
  const tolerance = config.shapes.alignmentTolerance;
  let changed;

  do {
    changed = false;
    edges.forEach((edge) => {
      // Find shapes sharing this edge and align them
      const shapesWithEdge = shapes.filter((shape) => hasEdge(shape, edge, tolerance));

      if (shapesWithEdge.length > 1) {
        const aligned = alignEdge(shapesWithEdge, edge, tolerance);
        changed = changed || aligned;
      }
    });
  } while (changed);
};

export const applyCubismEffect: ArtEffect = (ctx, img, width, height, config?: { granularity?: number; randomness?: number }) => {
  const CUBISM_CONFIG = getCubismConfig(config?.granularity ?? 50, config?.randomness ?? 30);
  console.log("Starting cubism effect with config:", CUBISM_CONFIG);

  // Create temp canvas for analysis
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.drawImage(img, 0, 0, width, height);
  const imageData = tempCtx.getImageData(0, 0, width, height);

  // Find significant color regions
  const regions = findColorRegions(imageData, CUBISM_CONFIG);
  console.log("Found color regions:", regions.length);

  // Create aligned shapes from regions
  const shapes = createAlignedShapes(regions, width, height, CUBISM_CONFIG);
  console.log("Created shapes:", shapes.length);

  if (shapes.length === 0) {
    // Fallback to simpler triangulation if no shapes were created
    console.log("No shapes created, using fallback triangulation");
    const gridSize = Math.max(20, 100 - CUBISM_CONFIG.colorAnalysis.colorCount);
    const defaultShapes = createGridShapes(imageData, gridSize);
    shapes.push(...defaultShapes);
  }

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw shapes
  shapes.forEach((shape) => {
    ctx.save();

    // Draw shadow
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.moveTo(shape.points[0].x + 2, shape.points[0].y + 2);
    shape.points.slice(1).forEach((p) => ctx.lineTo(p.x + 2, p.y + 2));
    ctx.closePath();
    ctx.fill();

    // Draw shape
    ctx.beginPath();
    ctx.moveTo(shape.points[0].x, shape.points[0].y);
    shape.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();

    // Fill with slightly varied color
    const variation = (Math.random() - 0.5) * CUBISM_CONFIG.style.shadeVariation;
    ctx.fillStyle = `rgb(
      ${clamp(shape.color.r + variation * 255, 0, 255)},
      ${clamp(shape.color.g + variation * 255, 0, 255)},
      ${clamp(shape.color.b + variation * 255, 0, 255)}
    )`;
    ctx.fill();

    // Draw border
    ctx.strokeStyle = `rgba(0,0,0,${CUBISM_CONFIG.style.borderOpacity})`;
    ctx.lineWidth = CUBISM_CONFIG.style.borderWidth;
    ctx.stroke();

    ctx.restore();
  });
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createGridShapes = (imageData: ImageData, gridSize: number): Shape[] => {
  const shapes: Shape[] = [];
  const { width, height } = imageData;

  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      // Create two triangles for each grid cell
      const points = [
        { x, y },
        { x: x + gridSize, y },
        { x: x + gridSize, y: y + gridSize },
        { x, y: y + gridSize }
      ];

      // Sample color from center of grid cell
      const centerX = x + gridSize / 2;
      const centerY = y + gridSize / 2;
      const i = (Math.min(Math.floor(centerY), height - 1) * width + Math.min(Math.floor(centerX), width - 1)) * 4;
      const color = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2]
      };

      // Add two triangles
      shapes.push({
        points: [points[0], points[1], points[2]],
        color,
        neighbors: [],
        id: shapes.length
      });

      shapes.push({
        points: [points[0], points[2], points[3]],
        color,
        neighbors: [],
        id: shapes.length
      });
    }
  }

  return shapes;
};

// Find boundary points of a region using Moore neighborhood tracing
const findBoundaryPoints = (points: Point[], width: number, height: number): Point[] => {
  // Create a binary image for the region
  const grid = new Array(height).fill(0).map(() => new Array(width).fill(false));
  points.forEach((p) => {
    if (p.x >= 0 && p.x < width && p.y >= 0 && p.y < height) {
      grid[p.y][p.x] = true;
    }
  });

  // Find starting point (leftmost then topmost point)
  let start: Point | null = null;
  for (let x = 0; x < width && !start; x++) {
    for (let y = 0; y < height && !start; y++) {
      if (grid[y][x]) {
        start = { x, y };
      }
    }
  }
  if (!start) return [];

  const boundary: Point[] = [];
  const directions = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
  ];

  let current = start;
  let dir = 0; // Start moving right

  do {
    boundary.push(current);

    // Look for next boundary point
    let found = false;
    let count = 0;

    while (!found && count < 8) {
      const nextDir = (dir + 5) % 8; // Turn left (counterclockwise)
      const next = {
        x: current.x + directions[nextDir].x,
        y: current.y + directions[nextDir].y,
      };

      if (next.x >= 0 && next.x < width && next.y >= 0 && next.y < height) {
        if (grid[next.y][next.x]) {
          current = next;
          dir = nextDir;
          found = true;
        }
      }

      if (!found) {
        dir = (dir + 1) % 8;
        count++;
      }
    }

    if (!found) break;
  } while (current.x !== start.x || current.y !== start.y);

  return boundary;
};

// Simplify polygon using Ramer-Douglas-Peucker algorithm with angle constraints
const simplifyPolygon = (points: Point[], minAngle: number): Point[] => {
  if (points.length <= 3) return points;

  const angleInDegrees = (p1: Point, p2: Point, p3: Point): number => {
    const a = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    const b = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = ((a - b) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
  };

  const distanceToLine = (point: Point, start: Point, end: Point): number => {
    const numerator = Math.abs((end.y - start.y) * point.x - (end.x - start.x) * point.y + end.x * start.y - end.y * start.x);
    const denominator = Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
    return numerator / denominator;
  };

  const simplifySection = (start: number, end: number, output: Point[]): void => {
    if (end - start <= 1) return;

    // Find point with maximum distance
    let maxDistance = 0;
    let maxIndex = start;

    for (let i = start + 1; i < end; i++) {
      const distance = distanceToLine(points[i], points[start], points[end]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }

    // Check angles
    const angle1 = angleInDegrees(points[start], points[maxIndex], points[end]);
    const angle2 = angleInDegrees(points[end], points[maxIndex], points[start]);
    const minAngleThreshold = minAngle;

    if (maxDistance > 1 && angle1 > minAngleThreshold && angle2 > minAngleThreshold) {
      simplifySection(start, maxIndex, output);
      output.push(points[maxIndex]);
      simplifySection(maxIndex, end, output);
    }
  };

  const result = [points[0]];
  simplifySection(0, points.length - 1, result);
  result.push(points[points.length - 1]);

  return result;
};

// Check if a shape has a given edge (within tolerance)
const hasEdge = (shape: Shape, edgeKey: string, tolerance: number): boolean => {
  const [start, end] = edgeKey.split("_").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });

  for (let i = 0; i < shape.points.length; i++) {
    const p1 = shape.points[i];
    const p2 = shape.points[(i + 1) % shape.points.length];

    const d1 = Math.min(distance(p1, start) + distance(p2, end), distance(p1, end) + distance(p2, start));

    if (d1 < tolerance) return true;
  }
  return false;
};

// Helper to calculate distance between points
const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Align shapes along a shared edge
const alignEdge = (shapes: Shape[], edgeKey: string, tolerance: number): boolean => {
  const [start, end] = edgeKey.split("_").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });

  let changed = false;

  shapes.forEach((shape) => {
    for (let i = 0; i < shape.points.length; i++) {
      const p1 = shape.points[i];
      const p2 = shape.points[(i + 1) % shape.points.length];

      if (distance(p1, start) < tolerance) {
        shape.points[i] = start;
        changed = true;
      }
      if (distance(p1, end) < tolerance) {
        shape.points[i] = end;
        changed = true;
      }
      if (distance(p2, start) < tolerance) {
        shape.points[(i + 1) % shape.points.length] = start;
        changed = true;
      }
      if (distance(p2, end) < tolerance) {
        shape.points[(i + 1) % shape.points.length] = end;
        changed = true;
      }
    }
  });

  return changed;
};
