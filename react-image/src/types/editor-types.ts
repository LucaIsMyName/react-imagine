// src/types/editor-types.ts
export type ArtStyle = 'none' | 'cubism' | 'pointillism' | 'modern' | 'abstract';

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  highlights: number;
  shadows: number;
  artStyle: ArtStyle;
}

export interface EditorState {
  image: string | null;
  filterSettings: FilterSettings;
}

export type FilterAction =
  | { type: 'SET_IMAGE'; payload: string | null }
  | { type: 'UPDATE_FILTER'; payload: Partial<FilterSettings> }
  | { type: 'RESET_FILTERS' };