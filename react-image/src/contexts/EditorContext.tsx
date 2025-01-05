// src/contexts/EditorContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { EditorState, FilterSettings, FilterAction, ImageMetadata } from "@/types/editor-types";

const defaultFilterSettings: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  highlights: 0,
  shadows: 0,
  artStyle: "none",
};

const defaultMetadata: ImageMetadata = {
  title: '',
  description: '',
  copyright: '',
  author: '',
  keywords: [],
  dateCreated: new Date().toISOString().split('T')[0],
  location: '',
  altText: '',
};

// Get initial state from localStorage if available
const getInitialState = (): EditorState => {
  const savedState = localStorage.getItem('editorState');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      return {
        ...parsed,
        metadata: { ...defaultMetadata, ...parsed.metadata }, // Ensure all metadata fields exist
      };
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }
  return {
    image: null,
    filterSettings: defaultFilterSettings,
    metadata: defaultMetadata,
  };
};

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<FilterAction>;
} | null>(null);

const editorReducer = (state: EditorState, action: FilterAction): EditorState => {
  let newState: EditorState;

  switch (action.type) {
    case "SET_IMAGE":
      newState = {
        ...state,
        image: action.payload,
        // Reset filters when setting a new image or when clearing the image
        ...(action.payload === null && { 
          filterSettings: defaultFilterSettings,
          metadata: defaultMetadata,
        }),
      };
      break;

    case "UPDATE_FILTER":
      newState = {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          ...action.payload,
        },
      };
      break;

    case "UPDATE_METADATA":
      newState = {
        ...state,
        metadata: {
          ...state.metadata,
          ...action.payload,
        },
      };
      break;

    case "RESET_FILTERS":
      newState = {
        ...state,
        filterSettings: defaultFilterSettings,
      };
      break;

    default:
      return state;
  }

  // Save to localStorage after every state change
  localStorage.setItem('editorState', JSON.stringify(newState));
  return newState;
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, getInitialState());

  // Optional: Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('editorState', JSON.stringify(state));
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