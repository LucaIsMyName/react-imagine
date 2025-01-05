// src/App.tsx
import { scan } from 'react-scan'; // import this BEFORE react
import React from "react";
import { Settings2 } from "lucide-react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EditorProvider } from "./contexts/EditorContext";
import GlobalSettings from "./components/GlobalSettings/GlobalSettings";
import EditArea from "./components/EditArea/EditArea";
import ImageArea from "./components/ImageArea/ImageArea";
if (typeof window !== 'undefined') {
  scan({
    enabled: true,
    log: false, // logs render info to console (default: false)
  });
}
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
          {/* Fixed top bar */}
          <GlobalSettings />

          {/* Desktop Layout */}
          <div className="hidden md:flex h-[calc(100vh-4rem)] mt-[68px]">
            {/* Sidebar */}
            <div className="w-full max-w-[clamp(240px,33vw,560px)] h-full border-r border-border bg-card overflow-y-auto">
              <EditArea />
            </div>

            {/* Main content */}
            <div className="flex-1 h-full overflow-y-auto">
              <ImageArea />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[calc(100vh-4rem)] mt-[68px]">
            {/* Main content area */}
            <div className="flex-1 overflow-y-auto">
              <ImageArea />
            </div>

            {/* Bottom sheet / Drawer */}
            <details className="group fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg backdrop-saturate-200 border-t border-border">
              <summary className="list-none p-4 cursor-pointer hover:bg-background/10 hover:bg-gradient-to-b from-muted-foreground/[0.025] to-transparent">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs">Edit Image</span>
                  <Settings2
                    strokeWidth={2}
                    className="size-4 text-foreground"
                  />
                </div>
              </summary>
              <div className=" max-h-[70vh] overflow-y-auto">
                <EditArea />
              </div>
            </details>
          </div>
        </div>
      </EditorProvider>
    </ThemeProvider>
  );
};

export default App;
