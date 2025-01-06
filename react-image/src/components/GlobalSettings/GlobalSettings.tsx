import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun, FolderOpen, Link, HelpCircle, FileText } from "lucide-react";
import { useDocWindow } from "../../contexts/DocWindowContext";
import Logo from "./Logo";
import FileBrowserDialog from "../FileBrowser/FileBrowserDialog";
import URLInputDialog from "../UrlInput/UrlInputDialog";
import { Button } from "@/components/ui/button";

const GlobalSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { dispatch } = useDocWindow();

  const handleHelpClick = () => {
    console.log("Help click - Before dispatch");
    dispatch({ 
      type: "TOGGLE_WINDOW", 
      payload: "help"
    });
    console.log("Help click - After dispatch");
  };
  
  const handleDocsClick = () => {
    console.log("Docs click - Before dispatch");
    dispatch({ 
      type: "TOGGLE_WINDOW", 
      payload: "docs"
    });
    console.log("Docs click - After dispatch");
  };

  return (
    <header className="border-b fixed top-0 left-0 w-full shadow-inner z-40">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="flex-1 text-2xl font-bold flex gap-4 items-center truncate">
          <div className="hidden md:block">
            <Logo
              className="min-h-8 max-h-8 h-8 w-auto"
              isWordmark={true}
            />
          </div>
          <div className="md:hidden">
            <Logo className="min-w-8 max-w-8 size-8 w-auto" />
          </div>
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2 pr-4 border-r">
            <Button
              variant="link"
              size="sm"
              className="gap-2"
              onClick={handleHelpClick}>
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            <Button
              variant="link"
              size="sm"
              className="gap-2"
              onClick={handleDocsClick}>
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Docs</span>
            </Button>
          </div>

          <FileBrowserDialog>
            <Button
              variant="outline"
              size="sm"
              className="gap-2">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span>
            </Button>
          </FileBrowserDialog>

          <URLInputDialog>
            <Button
              variant="outline"
              size="sm"
              className="gap-2">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">URL</span>
            </Button>
          </URLInputDialog>

          <div className="ml-2 pl-4 border-l">
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="px-3">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalSettings;
