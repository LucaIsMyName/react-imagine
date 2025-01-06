// src/contexts/DocWindowContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";

type ContentType = "help" | "docs" | null;

interface WindowPosition {
  x: number;
  y: number;
}

interface DocWindowState {
  isOpen: boolean;
  width: number;
  height: number;
  content: ContentType;
  position: WindowPosition;
}

type DocWindowAction = { type: "TOGGLE_WINDOW"; payload?: ContentType } | { type: "RESIZE"; payload: { width?: number; height?: number } } | { type: "MOVE"; payload: WindowPosition } | { type: "CLOSE" };
const constrainPosition = (x: number, y: number, width: number, height: number) => {
  const padding = 20; // Padding from screen edges
  return {
    x: Math.max(
      -width + 100, // Never hide more than width-100px off screen left
      Math.min(window.innerWidth - 100, x) // Never hide more than width-100px off screen right
    ),
    y: Math.max(
      0, // Never allow moving above top of screen
      Math.min(window.innerHeight - 50, y) // Always keep at least 50px visible at bottom
    ),
  };
};

const calculateDefaultPosition = () => {
  if (typeof window === "undefined") return { x: 0, y: 0 };

  const width = 600;
  const height = 500;
  const padding = 20;

  // Use constrainPosition here too
  return constrainPosition(Math.floor(((window.innerWidth - width) / 2) * -1), Math.floor(((window.innerHeight - height) / 2) * -1), width, height);
};

const defaultState: DocWindowState = {
  isOpen: false,
  width: 600, // Increased from 300
  height: 500, // Increased from 300
  content: null,
  position: calculateDefaultPosition(),
};

// Get initial state from localStorage
const getInitialState = (): DocWindowState => {
  try {
    const saved = localStorage.getItem("docWindowState");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState, // Start with defaults
        ...parsed, // Override with saved values
        // Ensure minimum dimensions
        width: Math.max(300, parsed.width || defaultState.width),
        height: Math.max(300, parsed.height || defaultState.height),
        isOpen: false, // Always start closed
      };
    }
  } catch (e) {
    console.error("Failed to parse doc window state:", e);
  }
  return defaultState;
};

const docWindowReducer = (state: DocWindowState, action: DocWindowAction): DocWindowState => {
  let newState: DocWindowState;

  switch (action.type) {
    case "TOGGLE_WINDOW":
      if (action.payload) {
        const width = Math.max(300, state.width);
        const height = Math.max(300, state.height);
        const constrainedPosition = constrainPosition(state.position.x, state.position.y, width, height);

        newState = {
          ...state,
          isOpen: true,
          content: action.payload,
          width,
          height,
          position: constrainedPosition,
        };
      } else {
        newState = {
          ...state,
          isOpen: !state.isOpen,
          content: action.payload || state.content,
        };
      }
      break;

    case "RESIZE":
      newState = {
        ...state,
        width: action.payload.width || state.width,
        height: action.payload.height || state.height,
      };
      break;

    case "MOVE":
      newState = {
        ...state,
        position: action.payload,
      };
      break;

    case "CLOSE":
      newState = {
        ...state,
        isOpen: false,
      };
      break;

    default:
      return state;
  }

  localStorage.setItem("docWindowState", JSON.stringify(newState));
  return newState;
};

interface DocWindowContextType {
  state: DocWindowState;
  dispatch: React.Dispatch<DocWindowAction>;
}

const DocWindowContext = createContext<DocWindowContextType | null>(null);

export const DocWindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(docWindowReducer, getInitialState());

  useEffect(() => {
    console.log("DocWindow State Updated:", state); // Add this log
    localStorage.setItem("docWindowState", JSON.stringify(state));
  }, [state]);

  return <DocWindowContext.Provider value={{ state, dispatch }}>{children}</DocWindowContext.Provider>;
};

export const useDocWindow = () => {
  const context = useContext(DocWindowContext);
  if (!context) {
    throw new Error("useDocWindow must be used within a DocWindowProvider");
  }
  return context;
};

export { constrainPosition };
