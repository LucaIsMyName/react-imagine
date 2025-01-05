import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun, FolderOpen, Link } from "lucide-react";
import Logo from "./Logo";
import FileBrowserDialog from "../FileBrowser/FileBrowserDialog";
import URLInputDialog from "../URLInput/URLInputDialog";
import { Button } from "@/components/ui/button";

const GlobalSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b absolute top-0 left-0 w-full shadow-inner">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="flex-1 text-2xl font-bold flex gap-4 items-center truncate">
          <Logo className="min-w-8 max-w-8 size-8 " />
          <span className="truncate hidden md:block font-semibold text-foreground/80">Imagine Editor</span>
        </h1>
        
        <div className="flex items-center gap-2">
          <FileBrowserDialog>
            <Button variant="outline" size="sm" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span>
            </Button>
          </FileBrowserDialog>

          <URLInputDialog>
            <Button variant="outline" size="sm" className="gap-2">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">URL</span>
            </Button>
          </URLInputDialog>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default GlobalSettings;