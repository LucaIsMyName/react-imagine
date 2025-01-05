// src/contexts/EditorContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  vibrance: number;
  temperature: number;
  tint: number;
}

interface EditorState {
  image: string | null;
  filterSettings: FilterSettings;
  preset: string | null;
  history: FilterSettings[];
  historyIndex: number;
}

type EditorAction =
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'UPDATE_FILTER'; payload: Partial<FilterSettings> }
  | { type: 'APPLY_PRESET'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_FILTERS' };

const defaultFilterSettings: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  clarity: 0,
  vibrance: 0,
  temperature: 0,
  tint: 0,
};

const initialState: EditorState = {
  image: null,
  filterSettings: defaultFilterSettings,
  preset: null,
  history: [defaultFilterSettings],
  historyIndex: 0,
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_IMAGE':
      return {
        ...state,
        image: action.payload,
        filterSettings: defaultFilterSettings,
        history: [defaultFilterSettings],
        historyIndex: 0,
      };
    
    case 'UPDATE_FILTER':
      const newSettings = {
        ...state.filterSettings,
        ...action.payload,
      };
      
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        newSettings,
      ];

      return {
        ...state,
        filterSettings: newSettings,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filterSettings: defaultFilterSettings,
        history: [...state.history, defaultFilterSettings],
        historyIndex: state.history.length,
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          filterSettings: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          filterSettings: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
};

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Save filter settings to localStorage
  useEffect(() => {
    if (state.filterSettings !== defaultFilterSettings) {
      localStorage.setItem('filterSettings', JSON.stringify(state.filterSettings));
    }
  }, [state.filterSettings]);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};