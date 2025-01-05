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
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalSettings;
