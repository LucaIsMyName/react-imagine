// src/types/image-types.ts
export interface ImageSize {
  name: string;
  width: number;
  scale: number;
}

export const imageSizes = {
  original: { name: 'Original', width: 0, scale: 1 },
  large: { name: 'Large', width: 1920, scale: 0.75 },
  medium: { name: 'Medium', width: 1280, scale: 0.5 },
  small: { name: 'Small', width: 800, scale: 0.25 },
} as const;

export const imageFormats = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
] as const;