// src/contexts/EditorContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  highlights: number;
  shadows: number;
  artStyle: "none" | "cubism" | "modern" | "abstract" | "pointillism" | "renaissance";
}

interface EditorState {
  image: string | null;
  filterSettings: FilterSettings;
}

type EditorAction = { type: "SET_IMAGE"; payload: string } | { type: "UPDATE_FILTER"; payload: Partial<FilterSettings> } | { type: "RESET_FILTERS" } | { type: "LOAD_SAVED_STATE"; payload: EditorState };

const defaultFilterSettings: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  highlights: 0,
  shadows: 0,
  artStyle: "none",
};

// Get initial state from localStorage or use default
const getInitialState = (): EditorState => {
  const savedState = localStorage.getItem("editorState");
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error("Failed to parse saved state:", e);
    }
  }
  return {
    image: null,
    filterSettings: defaultFilterSettings,
  };
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        image: action.payload,
        ...(action.payload === null && { filterSettings: defaultFilterSettings }),
      };

    case "UPDATE_FILTER":
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          ...action.payload,
        },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filterSettings: defaultFilterSettings,
      };

    case "LOAD_SAVED_STATE":
      return action.payload;

    default:
      return state;
  }
};

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, getInitialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("editorState", JSON.stringify(state));
  }, [state]);

  return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
