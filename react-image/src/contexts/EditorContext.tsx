
import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { EditorState, FilterSettings, FilterAction, ImageMetadata, CropMode, RotationMode, RotationSettings } from "@/types/editor-types";

interface EditorHistory {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}
const defaultCropSettings = {
  mode: "none" as CropMode,
  aspectRatio: undefined,
  x: 0,
  y: 0,
  width: 100,
  height: 100
};
const defaultRotationSettings: RotationSettings = {
  mode: "none" as RotationMode,
  angle: 0
};
const defaultFilterSettings: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  highlights: 0,
  shadows: 0,
  artStyle: "none",
  artGranularity: 50,
  artRandomness: 30,
  rasterStyle: "none",
  rasterGranularity: 50,
  rasterRandomness: 30,
  cropMode: "none",
  
};

const defaultMetadata: ImageMetadata = {
  title: "",
  description: "",
  copyright: "",
  author: "",
  keywords: [],
  dateCreated: new Date().toISOString().split("T")[0],
  location: "",
  altText: "",
};

const getInitialState = (): EditorState => {
  const savedState = localStorage.getItem("editorState");
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      return {
        ...parsed,
        metadata: { ...defaultMetadata, ...parsed.metadata },
        filterSettings: { ...defaultFilterSettings, ...parsed.filterSettings },
        cropSettings: { ...defaultCropSettings, ...parsed.cropSettings },
        rotationSettings: { ...defaultRotationSettings, ...parsed.rotationSettings }
      };
    } catch (e) {
      console.error("Failed to parse saved state:", e);
    }
  }
  return {
    image: null,
    filterSettings: defaultFilterSettings,
    metadata: defaultMetadata,
    cropSettings: defaultCropSettings,
    rotationSettings: defaultRotationSettings
  };
};

const initialHistory: EditorHistory = {
  past: [],
  present: getInitialState(),
  future: [],
};

type EditorActionWithHistory = FilterAction | { type: "UNDO" } | { type: "REDO" };

const EditorContext = createContext<{
  state: EditorState;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: React.Dispatch<EditorActionWithHistory>;
} | null>(null);

const MAX_HISTORY_LENGTH = 50; // Limit history to prevent memory issues

const editorReducer = (history: EditorHistory, action: EditorActionWithHistory): EditorHistory => {
  const { past, present, future } = history;

  switch (action.type) {
    case "UNDO": {
      if (past.length === 0) return history;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }

    case "REDO": {
      if (future.length === 0) return history;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    default: {
      let newPresent: EditorState;
      
      switch (action.type) {
        case "SET_IMAGE":
          newPresent = {
            ...present,
            image: action.payload,
            ...(action.payload === null && {
              filterSettings: defaultFilterSettings,
              metadata: defaultMetadata,
            }),
          };
          break;

        case "UPDATE_FILTER":
          newPresent = {
            ...present,
            filterSettings: {
              ...present.filterSettings,
              ...action.payload,
            },
          };
          break;

        case "UPDATE_CROP": {
          const { mode, aspectRatio, ...cropSettings } = action.payload;
          newPresent = {
            ...present,
            filterSettings: {
              ...present.filterSettings,
              cropMode: mode,
            },
            cropSettings: {
              aspectRatio,
              ...cropSettings,
            },
          };
          break;
        }

        case "RESET_FILTERS":
          newPresent = {
            ...present,
            filterSettings: defaultFilterSettings,
          };
          break;
        default:
          return history;
      }

      return {
        past: [...past, present].slice(-MAX_HISTORY_LENGTH),
        present: newPresent,
        future: [],
      };
    }
  }
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, dispatch] = useReducer(editorReducer, initialHistory);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("editorState", JSON.stringify(history.present));
  }, [history.present]);

  const value = {
    state: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    dispatch,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
