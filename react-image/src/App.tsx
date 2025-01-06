// src/App.tsx
import { scan } from "react-scan";
import React from "react";
import { Settings2 } from "lucide-react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EditorProvider } from "./contexts/EditorContext";
import { DocWindowProvider } from "./contexts/DocWindowContext";
import GlobalSettings from "./components/GlobalSettings/GlobalSettings";
import EditArea from "./components/EditArea/EditArea";
import ImageArea from "./components/ImageArea/ImageArea";
import DocWindow from "./components/DocWindow/DocWindow";

if (typeof window !== "undefined") {
  scan({
    enabled: true,
    log: false,
  });
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <DocWindowProvider>
          <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
            {/* Fixed top bar */}
            <GlobalSettings />

            {/* Main layout container */}
            <div className="mt-[68px] h-[calc(100vh-4rem)]">
              {/* Shared ImageArea - always visible */}
              <div
                className={`
                h-full
                md:ml-[clamp(240px,33vw,560px)]
                transition-[margin]
                duration-300
                ease-in-out
              `}>
                <ImageArea />
              </div>

              {/* Desktop Sidebar */}
              <div
                className="
                hidden md:block 
                fixed top-[68px] left-0 
                w-[clamp(240px,33vw,560px)] h-[calc(100vh-4rem)]
                border-r border-border bg-card 
                overflow-y-auto
              ">
                <EditArea />
              </div>

              {/* Mobile Bottom Sheet */}
              <details
                className="
                md:hidden
                group fixed bottom-0 left-0 right-0 
                bg-background/90 backdrop-blur-lg backdrop-saturate-100 
                border-t border-border
                shadow-lg
                z-10
              ">
                <summary className="list-none p-4 cursor-pointer hover:bg-background/10 hover:bg-gradient-to-b from-muted-foreground/[0.025] to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs">Edit Image</span>
                    <Settings2
                      strokeWidth={2}
                      className="size-4 text-foreground"
                    />
                  </div>
                </summary>
                <div className="max-h-[70vh] overflow-y-auto">
                  <EditArea />
                </div>
              </details>
            </div>

            {/* Documentation Window */}
            <DocWindow />
          </div>
        </DocWindowProvider>
      </EditorProvider>
    </ThemeProvider>
  );
};

export default App;
