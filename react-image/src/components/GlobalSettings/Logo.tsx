import { useTheme } from "@/contexts/ThemeContext";

interface LogoProps {
  className?: string;
  isWordmark?: boolean;
}

interface LogoIconProps {
  theme: string;
  className?: string;
}

const LogoIcon = ({ className }: LogoIconProps) => {
  const { theme } = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      className={className}
      viewBox="0 0 32 32">
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_7"
            data-name="Rectangle 7"
            width="32"
            height="32"
            transform="translate(118 -104)"
            fill="none"
            stroke="#2f2f2f"
            stroke-width="1"
          />
        </clipPath>
      </defs>
      <g
        id="Mask_Group_1"
        data-name="Mask Group 1"
        transform="translate(-118 104)"
        clip-path="url(#clip-path)">
        <g
          id="Rectangle_4"
          data-name="Rectangle 4"
          transform="translate(118 -104)"
          fill="none"
          stroke="#2f2f2f"
          stroke-width="1">
          <rect
            width="32"
            height="32"
            stroke="none"
          />
          <rect
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            fill="none"
          />
        </g>
        <g
          id="Path_8"
          data-name="Path 8"
          transform="translate(118 -104)"
          fill="none">
          <path
            d="M0,0H32L0,32Z"
            stroke="none"
          />
          <path
            d="M 1 1 L 1 29.58577919006348 L 29.58577919006348 1 L 1 1 M 0 0 L 32 0 L 0 32 L 0 0 Z"
            stroke="none"
            fill="#5c5c5c"
          />
        </g>
        <g
          id="Path_9"
          data-name="Path 9"
          transform="translate(118 -104)"
          fill="none">
          <path
            d="M0,0H0Z"
            stroke="none"
          />
          <path
            d="M 0 0 L 32 0 L 0 0 Z"
            stroke="none"
            fill="#cecece"
          />
        </g>
        <line
          id="Line_1"
          data-name="Line 1"
          x2="33"
          transform="translate(117.5 -103.5)"
          fill="none"
          stroke="#939393"
          stroke-width="1"
        />
        <line
          id="Line_2"
          data-name="Line 2"
          x2="33"
          transform="translate(117.5 -72.5)"
          fill="none"
          stroke="#000"
          stroke-width="1"
        />
        <g
          id="Rectangle_5"
          data-name="Rectangle 5"
          transform="translate(119 -103)"
          fill="none"
          stroke="#e8e8e8"
          stroke-width="1.5">
          <rect
            width="30"
            height="30"
            stroke="none"
          />
          <rect
            x="0.75"
            y="0.75"
            width="28.5"
            height="28.5"
            fill="none"
          />
        </g>
        <g
          id="Path_10"
          data-name="Path 10"
          transform="translate(119 -103)"
          fill="none">
          <path
            d="M0,0,30,30H0Z"
            stroke="none"
          />
          <path
            d="M 1.5 3.621320724487305 L 1.5 28.5 L 26.3786792755127 28.5 L 1.5 3.621320724487305 M 0 0 L 30 30 L 0 30 L 0 0 Z"
            stroke="none"
            fill="#d5d5d5"
          />
        </g>
        <g
          id="Group_2"
          data-name="Group 2">
          <rect
            id="Rectangle_6"
            data-name="Rectangle 6"
            width="28"
            height="28"
            transform="translate(120 -102)"
            className="transition-all duration-300 ease-in-out"
            fill={theme === "dark" ? "#3e00ff" : "#3eb5ff"}
          />
          <circle
            id="Ellipse_2"
            data-name="Ellipse 2"
            cx="5"
            cy="5"
            r={theme === "dark" ? "3" : "5"}
            transform="translate(122 -100)"
            className="transition-all duration-300 ease-in-out"
            fill={theme === "dark" ? "rgba(255,255,255,0.9)" : "#FFF726"}
          />
          <path
            id="Path_7"
            data-name="Path 7"
            d="M120.569-73.81v-7.438l9.834-7.914,6.644,4.811L148.569-94.81v21Z"
            transform="translate(-0.569 -0.19)"
            fill={theme === "dark" ? "#00ffea" : "#00ff7f"}
          />
        </g>
      </g>
    </svg>
  );
};

export const Logo = ({ className, isWordmark }: LogoProps) => {
  const { theme } = useTheme();
  if (isWordmark) {
    return (
      <section className={`flex items-center gap-3 ${className}`}>
        <LogoIcon theme="" className="" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="144.4"
          height="17.58"
          style={{
            transform: "translateY(1px)"
          }}
          className="h-4 w-auto transition-all duration-300 ease-in-out"
          viewBox="0 0 144.4 17.58">
          <g
            id="Group_1"
            data-name="Group 1"
            transform="translate(-166 134.34)">
            <path
              fill={theme === "dark" ? "#fff" : "#000"}
              id="Path_6"
              data-name="Path 6"
              d="M1.52,0h8.96V-2.28H7.24v-9.64h3.24V-14.2H1.52v2.28H4.76v9.64H1.52ZM11.88,0h2.26V-6.84c0-1.44.42-2.06,1.1-2.06.66,0,.94.56.94,2.04V0H18.3V-6.84c0-1.44.46-2.06,1.12-2.06.62,0,.92.48.92,2.04V0H22.6V-7.32c0-2.5-.74-3.6-2.34-3.6a2.414,2.414,0,0,0-2.3,2c-.28-1.34-.86-2-1.96-2A2.213,2.213,0,0,0,13.92-9.1l-.06-1.58H11.88ZM27,.24a3.525,3.525,0,0,0,3.3-1.8A2.1,2.1,0,0,0,32.62.08,7.851,7.851,0,0,0,33.56,0V-1.84h-.52c-.4,0-.6-.18-.6-.7V-6.52c0-2.76-1.42-4.4-4.34-4.4a4.252,4.252,0,0,0-4.5,3.44l2.46.14a1.927,1.927,0,0,1,2.08-1.6c1.32,0,1.94.8,1.94,2.3l-3.34.7c-2.12.44-3.3,1.4-3.3,3.2C23.44-.9,25.02.24,27,.24Zm.42-1.84c-.98,0-1.52-.48-1.52-1.28,0-.78.38-1.2,1.52-1.44l2.66-.56v.72A2.376,2.376,0,0,1,27.42-1.6ZM39.66,3.24c3,0,4.9-1.52,4.9-4.34v-9.58H42.28l-.04,1.64a3.253,3.253,0,0,0-3.12-1.88c-2.6,0-4.44,2.08-4.44,5.24,0,3.02,1.88,5.12,4.5,5.12A3.187,3.187,0,0,0,42.2-2.28v1.4c0,1.4-.9,2.12-2.54,2.12-1.28,0-1.88-.46-2.14-1.24L35.04.16C35.5,2.02,37.14,3.24,39.66,3.24Zm0-5.78c-1.58,0-2.52-1.14-2.52-3.18s.92-3.2,2.52-3.2c1.52,0,2.56,1.16,2.54,3.2S41.16-2.54,39.66-2.54ZM50.38-12.1h2.4v-2.24h-2.4ZM46.4,0h9.92V-1.92H52.84v-8.76H46.6v1.92h3.88v6.84H46.4ZM57.72,0h2.36V-6.26A2.359,2.359,0,0,1,62.42-8.9c1.28,0,1.9.84,1.9,2.56V0h2.36V-6.9c0-2.32-1.12-4.02-3.46-4.02a3.278,3.278,0,0,0-3.28,2.16l-.06-1.92H57.72ZM73.54.24a4.65,4.65,0,0,0,4.68-3.42L75.8-3.36a2.176,2.176,0,0,1-2.22,1.48c-1.5,0-2.46-.98-2.6-2.8h7.44V-5.3c0-3.48-2.04-5.62-4.92-5.62-2.98,0-4.96,2.24-4.96,5.58C68.54-1.94,70.54.24,73.54.24ZM71-6.4a2.428,2.428,0,0,1,2.48-2.4,2.289,2.289,0,0,1,2.38,2.4ZM80.4,0h8.96V-2.28H82.88V-6.02h6.08v-2.2H82.88v-3.7H89.2V-14.2H80.4ZM94.92.24a3.46,3.46,0,0,0,3.22-1.9L98.2,0h2.24V-14.2H98.08v5.02a3.514,3.514,0,0,0-3.16-1.74c-2.66,0-4.36,2.08-4.36,5.58S92.26.24,94.92.24Zm.56-2.12c-1.58,0-2.46-1.28-2.46-3.46,0-2.2.88-3.46,2.42-3.46,1.62,0,2.64,1.26,2.64,3.46C98.08-3.16,97.06-1.88,95.48-1.88Zm11.1-10.22h2.4v-2.24h-2.4ZM102.6,0h9.92V-1.92h-3.48v-8.76H102.8v1.92h3.88v6.84H102.6Zm17.3,0h3.06V-1.92h-2.64c-.96,0-1.42-.48-1.42-1.46V-8.76h4.06v-1.92H118.9v-2.5h-2.36v2.5h-3.22v1.92h3.22V-3.2C116.54-1.02,117.6,0,119.9,0Zm9.74.24c3,0,5-2.18,5-5.58s-2-5.58-5-5.58c-3.02,0-5,2.18-5,5.58S126.62.24,129.64.24Zm0-2.12c-1.62,0-2.54-1.26-2.54-3.46s.92-3.46,2.54-3.46,2.54,1.26,2.54,3.46S131.26-1.88,129.64-1.88ZM136.44,0h8.3V-1.92h-3.3V-6.24c0-1.62.76-2.46,2.28-2.46h2.2v-1.98h-2.34a2.4,2.4,0,0,0-2.56,2.06l-.14-2.06h-4.44v1.92h2.64v6.84h-2.64Z"
              transform="translate(164.48 -120)"
            />
          </g>
        </svg>
      </section>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      className={className}
      viewBox="0 0 32 32">
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_7"
            data-name="Rectangle 7"
            width="32"
            height="32"
            transform="translate(118 -104)"
            fill="none"
            stroke="#2f2f2f"
            stroke-width="1"
          />
        </clipPath>
      </defs>
      <g
        id="Mask_Group_1"
        data-name="Mask Group 1"
        transform="translate(-118 104)"
        clip-path="url(#clip-path)">
        <g
          id="Rectangle_4"
          data-name="Rectangle 4"
          transform="translate(118 -104)"
          fill="none"
          stroke="#2f2f2f"
          stroke-width="1">
          <rect
            width="32"
            height="32"
            stroke="none"
          />
          <rect
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            fill="none"
          />
        </g>
        <g
          id="Path_8"
          data-name="Path 8"
          transform="translate(118 -104)"
          fill="none">
          <path
            d="M0,0H32L0,32Z"
            stroke="none"
          />
          <path
            d="M 1 1 L 1 29.58577919006348 L 29.58577919006348 1 L 1 1 M 0 0 L 32 0 L 0 32 L 0 0 Z"
            stroke="none"
            fill="#5c5c5c"
          />
        </g>
        <g
          id="Path_9"
          data-name="Path 9"
          transform="translate(118 -104)"
          fill="none">
          <path
            d="M0,0H0Z"
            stroke="none"
          />
          <path
            d="M 0 0 L 32 0 L 0 0 Z"
            stroke="none"
            fill="#cecece"
          />
        </g>
        <line
          id="Line_1"
          data-name="Line 1"
          x2="33"
          transform="translate(117.5 -103.5)"
          fill="none"
          stroke="#939393"
          stroke-width="1"
        />
        <line
          id="Line_2"
          data-name="Line 2"
          x2="33"
          transform="translate(117.5 -72.5)"
          fill="none"
          stroke="#000"
          stroke-width="1"
        />
        <g
          id="Rectangle_5"
          data-name="Rectangle 5"
          transform="translate(119 -103)"
          fill="none"
          stroke="#e8e8e8"
          stroke-width="1.5">
          <rect
            width="30"
            height="30"
            stroke="none"
          />
          <rect
            x="0.75"
            y="0.75"
            width="28.5"
            height="28.5"
            fill="none"
          />
        </g>
        <g
          id="Path_10"
          data-name="Path 10"
          transform="translate(119 -103)"
          fill="none">
          <path
            d="M0,0,30,30H0Z"
            stroke="none"
          />
          <path
            d="M 1.5 3.621320724487305 L 1.5 28.5 L 26.3786792755127 28.5 L 1.5 3.621320724487305 M 0 0 L 30 30 L 0 30 L 0 0 Z"
            stroke="none"
            fill="#d5d5d5"
          />
        </g>
        <g
          id="Group_2"
          data-name="Group 2">
          <rect
            id="Rectangle_6"
            data-name="Rectangle 6"
            width="28"
            height="28"
            transform="translate(120 -102)"
            className="transition-all duration-300 ease-in-out"
            fill={theme === "dark" ? "#3e00ff" : "#3eb5ff"}
          />
          <circle
            id="Ellipse_2"
            data-name="Ellipse 2"
            cx="5"
            cy="5"
            r={theme === "dark" ? "3" : "5"}
            transform="translate(122 -100)"
            className="transition-all duration-300 ease-in-out"
            fill={theme === "dark" ? "rgba(255,255,255,0.9)" : "#FFF726"}
          />
          <path
            id="Path_7"
            data-name="Path 7"
            d="M120.569-73.81v-7.438l9.834-7.914,6.644,4.811L148.569-94.81v21Z"
            transform="translate(-0.569 -0.19)"
            fill={theme === "dark" ? "#00ffea" : "#00ff7f"}
          />
        </g>
      </g>
    </svg>
  );
};

export default Logo;
