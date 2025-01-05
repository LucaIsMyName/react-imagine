import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import Logo from "./Logo";

const GlobalSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b absolute top-0 left-0 w-full">
      <div className=" mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="flex-1 text-2xl font-bold flex gap-2 items-center">
          <Logo className="size-6" />
          <span>React Image</span>
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default GlobalSettings;
