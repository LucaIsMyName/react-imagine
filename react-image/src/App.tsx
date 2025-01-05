// src/App.tsx
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { EditorProvider } from './contexts/EditorContext';
import GlobalSettings from './components/GlobalSettings/GlobalSettings';
import EditArea from './components/EditArea/EditArea';
import ImageArea from './components/ImageArea/ImageArea';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
          {/* Fixed top bar */}
          <GlobalSettings />
          
          {/* Desktop Layout */}
          <div className="hidden md:flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className="w-80 h-full border-r border-border bg-card overflow-y-auto">
              <EditArea />
            </div>
            
            {/* Main content */}
            <div className="flex-1 h-full overflow-y-auto">
              <ImageArea />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[calc(100vh-4rem)]">
            {/* Main content area */}
            <div className="flex-1 overflow-y-auto">
              <ImageArea />
            </div>
            
            {/* Bottom sheet / Drawer */}
            <details className="group fixed bottom-0 left-0 right-0 bg-card border-t border-border">
              <summary className="list-none p-4 cursor-pointer hover:bg-accent">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Edit Image</span>
                  <div className="h-1 w-8 bg-muted-foreground rounded-full mx-auto" />
                </div>
              </summary>
              <div className="p-4 max-h-[70vh] overflow-y-auto">
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