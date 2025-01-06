// src/types/editor-types.ts
export type ArtStyle = "none" | "cubism" | "modern" | "abstract" | "pointillism" | "renaissance";
export type RasterStyle = "none" | "dots" | "lines-horizontal" | "lines-vertical";

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  highlights: number;
  shadows: number;
  artStyle: ArtStyle;
  rasterStyle: RasterStyle;
  rasterGranularity: number;
  rasterRandomness: number;
}

export type CropMode = "none" | "square" | "portrait" | "landscape" | "widescreen" | "video" | "free";

export type RotationMode = "none" | "90" | "180" | "270" | "free";

export interface CropSettings {
  mode: CropMode;
  aspectRatio?: number; // Width/Height ratio
  x: number; // Crop start X (percentage)
  y: number; // Crop start Y (percentage)
  width: number; // Crop width (percentage)
  height: number; // Crop height (percentage)
}

export interface RotationSettings {
  mode: RotationMode;
  angle: number; // Degrees
}

export interface ImageMetadata {
  title: string;
  description: string;
  copyright: string;
  author: string;
  keywords: string[];
  dateCreated: string;
  location: string;
  altText: string;
}

interface EditorState {
  image: File | null;
  filterSettings: FilterSettings;
  metadata: ImageMetadata;
  cropSettings: {
    mode: CropMode;
    aspectRatio?: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotationSettings: RotationSettings;
}
export type FilterAction = { type: "SET_IMAGE"; payload: string | null } | { type: "UPDATE_FILTER"; payload: Partial<FilterSettings> } | { type: "UPDATE_METADATA"; payload: Partial<ImageMetadata> } | { type: "RESET_FILTERS" };
