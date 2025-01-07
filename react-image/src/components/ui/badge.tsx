interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "destructive" | "warning" | "info" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge = ({ children, variant, size, className }: BadgeProps) => {
  function getVariant() {
    if (variant === "primary") return "bg-primary text-primary-foreground";
    if (variant === "secondary") return "bg-secondary text-secondary-foreground";
    if (variant === "success") return "bg-success text-success-foreground";
    if (variant === "destructive") return "bg-red-500 text-background border-red-800 border";
    if (variant === "warning") return "bg-orange-500 text-foreground border-orange-800 border";
    if (variant === "info") return "bg-gray-50 border text-foreground";
    if (variant === "light") return "bg-muted/30 border text-muted-foreground";
    if (variant === "dark") return "bg-foreground text-muted-background border";
    return "bg-background border text-foreground";
  }

  const getSize = () => {
    if (size === "sm") return "text-[11px]";
    if (size === "md") return "text-[13px]";
    if (size === "lg") return "text-[15px]";
    return "text-[11px]";
  };

  return (
    <div className={`inline-block ${getSize()} px-2 rounded-full ${getVariant()} ${className}`}>
      <span>{children}</span>
    </div>
  );
};

export default Badge;
