interface LogoProps {
  className?: string;
}
export const Logo = ({ className }: LogoProps) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32">
      <rect
        width="32"
        height="32"
        fill="#C0C0C0"
      />

      <path
        d="M0 0h32v1h-31v31h-1z"
        fill="#000000"
      />
      <path
        d="M1 1h30v1h-29v29h-1z"
        fill="#808080"
      />

      <path
        d="M31 0v32h-1v-31h-30v-1z"
        fill="#FFFFFF"
      />
      <path
        d="M30 1v30h-1v-29h-28v-1z"
        fill="#DFDFDF"
      />

      <rect
        x="4"
        y="4"
        width="24"
        height="20"
        fill="#FFFFFF"
      />

      <rect
        x="6"
        y="6"
        width="20"
        height="16"
        fill="#000080"
      />

      <circle
        cx="10"
        cy="10"
        r="3"
        fill="#FFFF00"
      />

      <path
        d="M6 22l8-10 4 5 8-7v6l-20 6z"
        fill="#008000"
      />

      <rect
        x="28"
        y="28"
        width="3"
        height="3"
        fill="#808080"
      />
    </svg>
  );
};

export default Logo;
