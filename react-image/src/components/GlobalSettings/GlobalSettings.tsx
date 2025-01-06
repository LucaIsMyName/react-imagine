import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun, Heart, FolderOpen, Github, Link, HelpCircle, FileText } from "lucide-react";
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
      payload: "help",
    });
    console.log("Help click - After dispatch");
  };

  const handleDocsClick = () => {
    console.log("Docs click - Before dispatch");
    dispatch({
      type: "TOGGLE_WINDOW",
      payload: "docs",
    });
    console.log("Docs click - After dispatch");
  };

  const handlePaymentClick = () => {
    dispatch({
      type: "TOGGLE_WINDOW",
      payload: "payment",
    });
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

        <div className="flex items-center gap-2 h-full">
          <div className="flex items-center gap-2 mr-2 pr-2 border-r h-full">
            <div className="hidden sm:flex items-center gap-4 pr-4 border-r h-full">
              <a
                href="https://lucamack.at/"
                target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="914"
                  height="914"
                  className="size-6 scale-[1] mr-2"
                  viewBox="0 0 914 914">
                  <g
                    id="Group_10"
                    data-name="Group 10"
                    transform="translate(-2 -1)">
                    <g
                      id="Group_8"
                      data-name="Group 8"
                      transform="translate(-55 -55)">
                      <g
                        id="Rectangle_12"
                        data-name="Rectangle 12"
                        transform="translate(57 970) rotate(-90)"
                        fill={theme === "dark" ? "transparent" : "#fff"}
                        stroke={theme === "dark" ? "#ffffff33" : "#000"}
                        stroke-width="0">
                        <rect
                          width="914"
                          height="914"
                          rx="169"
                          stroke="none"
                        />
                        <rect
                          x="15"
                          y="15"
                          width="884"
                          height="884"
                          rx="154"
                          fill="none"
                        />
                      </g>
                      <g
                        id="Group_9"
                        data-name="Group 9"
                        transform="translate(143.141 196.068)">
                        <path
                          id="Path_3"
                          fill={theme === "dark" ? "#fff" : "#000"}
                          data-name="Path 3"
                          d="M0,458.1c22.438-1.246,43.629-1.87,64.2-1.87,21.191,0,42.382.623,64.2,1.87v-7.479C96.606,446.259,91.62,426.314,91.62,388.3V0A610.335,610.335,0,0,1,0,7.479v8.1c28.67,4.363,36.773,28.047,36.773,62.327V388.3c0,38.019-13.712,57.964-36.773,62.327ZM294.182,158.31a286.24,286.24,0,0,1-38.642-2.493l-1.247,9.349c11.219,3.116,16.828,11.219,16.828,23.684,0,8.1-2.493,18.7-8.1,29.293-8.726,16.828-22.438,38.019-36.773,57.964l-21.191-73.545c-5.609-19.945-13.089-35.526-24.307-55.471a343.116,343.116,0,0,1-63.573,33.033l1.87,8.726a28.229,28.229,0,0,1,9.972-1.87c11.219,0,19.945,11.219,28.67,41.136l28.67,99.1c-25.554,35.526-50.485,65.443-77.908,91.62C95.36,432.547,80.4,443.143,66.69,448.752L64.82,458.1c9.349-1.87,22.438-3.116,36.773-3.116a323.171,323.171,0,0,1,42.382,3.116l2.493-9.349c-8.1-3.116-11.842-8.726-11.842-15.582,0-9.972,3.116-21.191,11.219-32.41,10.6-13.712,27.424-34.28,44.875-58.587l14.335,49.861c8.1,29.293,13.089,53.6,26.177,75.415,24.307-13.089,49.238-23.061,69.806-31.163l-2.493-8.726a48.441,48.441,0,0,1-9.972,1.247c-13.089,0-21.191-11.842-28.67-36.773L230.609,291.065c26.177-31.787,44.875-61.7,58.587-81.648,17.451-28.047,29.917-39.266,44.252-44.252l1.87-9.349A309.861,309.861,0,0,1,294.182,158.31ZM656.923,396.4V238.088c0-60.457-19.945-89.75-59.21-89.75-33.033,0-62.327,26.177-75.415,59.834-6.233-40.512-26.8-59.834-58.587-59.834-36.15,0-64.82,26.8-77.908,62.95,2.493-11.842,4.986-25.554,4.986-36.15V150.831c-29.917,4.986-61.7,5.609-94.113,4.986v8.1c34.9,4.363,36.149,34.28,36.149,63.573V384.556c0,34.28-7.479,56.717-36.149,66.066V458.1c21.191-1.246,38.642-1.87,56.717-1.87,19.944,0,39.266.623,62.95,1.87v-7.479C395.151,444.389,388.3,431.3,388.3,400.137V253.046c0-39.889,23.684-84.141,51.731-84.141,19.321,0,26.177,14.958,26.177,58.587V400.137c0,29.294-6.233,45.5-27.424,50.485V458.1c16.2-1.246,36.773-1.87,57.341-1.87,18.075,0,37.4.623,54.848,1.87v-7.479c-20.568-5.609-26.8-21.814-26.8-51.108V241.827c3.74-34.28,26.8-72.922,51.108-72.922,18.075,0,24.307,16.828,24.307,62.95V400.137c0,28.047-5.609,44.875-27.424,50.485V458.1c19.321-1.246,38.642-2.493,58.587-2.493s39.889,1.247,59.834,2.493v-7.479C664.4,444.389,656.923,426.314,656.923,396.4Z"
                          transform="translate(24.431 37.734)"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
              
              <a
                href="https://github.com/LucaIsMyName/react-imagine/tree/main/react-image"
                target="_blank">
                <Github className="w-4 h-4" />
              </a>
              <Button
                variant="link"
                size="sm"
                className="gap-2"
                onClick={handlePaymentClick}>
                <Heart className="w-4 h-4" />
                <span className="sr-only">Support</span>
              </Button>
            </div>
            <Button
              variant="link"
              size="sm"
              className="gap-2"
              onClick={handleHelpClick}>
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline text-xs text-muted-foreground">Help</span>
            </Button>
            <Button
              variant="link"
              size="sm"
              className="gap-2"
              onClick={handleDocsClick}>
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline text-xs text-muted-foreground">Docs</span>
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

          <div className="ml-2 pl-2 border-l">
            <Button
              onClick={toggleTheme}
              variant="link"
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
