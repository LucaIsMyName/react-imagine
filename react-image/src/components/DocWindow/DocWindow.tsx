// src/components/DocWindow/DocWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useDocWindow, constrainPosition } from "../../contexts/DocWindowContext";

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosX: number;
  startPosY: number;
}

export const DocWindow: React.FC = () => {
  const { state, dispatch } = useDocWindow();
  console.log("DocWindow Component Render State:", state); // Add this log
  const [content, setContent] = useState<string>("");
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 16,
    startY: -500,
    startPosX: 16,
    startPosY: -500,
  });

  const windowRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.isOpen) {
      setContent("");
    }
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen || !state.content) {
      console.log("Window not open or no content:", { isOpen: state.isOpen, content: state.content });
      return;
    }

    const fetchContent = async () => {
      try {
        const url = state.content === "help" ? "/docs/help.md" : "/docs/documentation.md";
        console.log("Fetching content from:", url);

        const response = await fetch(url);
        console.log("Fetch response:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log("Fetched content length:", text.length);
        setContent(text);
      } catch (error) {
        console.error("Failed to fetch content:", error);
        setContent(`Failed to load content. Error: ${error.message}`);
      }
    };

    fetchContent();
  }, [state.isOpen, state.content]);

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;

    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: state.position.x,
      startPosY: state.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const newX = dragState.startPosX + (e.clientX - dragState.startX);
      const newY = dragState.startPosY + (e.clientY - dragState.startY);

      const constrainedPosition = constrainPosition(newX, newY, Math.max(600, state.width), Math.max(500, state.height));

      dispatch({
        type: "MOVE",
        payload: constrainedPosition,
      });
    };

    const handleMouseUp = () => {
      setDragState((prev) => ({ ...prev, isDragging: false }));
    };

    if (dragState.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, dispatch]);

  // Handle window resizing
  useEffect(() => {
    if (!resizeRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      // Ensure window stays within bounds after resize
      const constrainedPosition = constrainPosition(state.position.x, state.position.y, Math.max(600, width), Math.max(500, height));

      dispatch({
        type: "RESIZE",
        payload: {
          width: Math.max(600, width),
          height: Math.max(500, height),
        },
      });

      // If position needed to be constrained, update it
      if (constrainedPosition.x !== state.position.x || constrainedPosition.y !== state.position.y) {
        dispatch({
          type: "MOVE",
          payload: constrainedPosition,
        });
      }
    });

    resizeObserver.observe(resizeRef.current);
    return () => resizeObserver.disconnect();
  }, [dispatch, state.position.x, state.position.y]);

  if (!state.isOpen) {
    console.log("Window not showing because isOpen is false. Full state:", state); // Enhanced log
    return null;
  }

  return (
    <div
      ref={windowRef}
      style={{
        width: Math.max(300, state.width), // Increased minimum
        height: Math.max(300, state.height), // Increased minimum
        transform: `translate(${state.position.x}px, ${(state.position.y)}px)`,
      }}
      className="fixed top-0 left-0 bg-background border rounded-lg shadow-lg overflow-hidden flex flex-col z-50">
      {/* Window Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between p-2 bg-muted/50 cursor-move border-b">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{state.content === "help" ? "Help Guide" : "Documentation"}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1"
          onClick={() => dispatch({ type: "CLOSE" })}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto p-4 min-h-[400px] bg-background">
        <ReactMarkdown
          className="prose dark:prose-invert max-w-none"
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-2xl font-bold mb-4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-semibold mb-3"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="mb-2"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc pl-4 mb-4"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pl-4 mb-4"
                {...props}
              />
            ),
          }}>
          {content}
        </ReactMarkdown>
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize hover:bg-muted/50 transition-colors"
        style={{
          background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)",
        }}
      />
    </div>
  );
};

export default DocWindow;
