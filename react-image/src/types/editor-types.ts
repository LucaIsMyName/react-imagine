// src/types/editor-types.ts
export type ArtStyle = 'none' | 'cubism' | 'modern' | 'abstract' | 'pointillism' | 'renaissance';

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  highlights: number;
  shadows: number;
  artStyle: ArtStyle;
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

export interface EditorState {
  image: string | null;
  filterSettings: FilterSettings;
  metadata: ImageMetadata;
}

export type FilterAction =
  | { type: 'SET_IMAGE'; payload: string | null }
  | { type: 'UPDATE_FILTER'; payload: Partial<FilterSettings> }
  | { type: 'UPDATE_METADATA'; payload: Partial<ImageMetadata> }
  | { type: 'RESET_FILTERS' };