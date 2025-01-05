// src/contexts/EditorContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { EditorState, FilterSettings, FilterAction } from "@/types/editor-types";

const defaultFilterSettings: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  highlights: 0,
  shadows: 0,
  artStyle: "none",
};

const initialState: EditorState = {
  image: null,
  filterSettings: defaultFilterSettings,
};

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<FilterAction>;
} | null>(null);

const editorReducer = (state: EditorState, action: FilterAction): EditorState => {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        image: action.payload,
        // Reset filters when setting a new image
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

    default:
      return state;
  }
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
