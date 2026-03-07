import { useState } from "react";

interface ChronicleButtonProps {
  inscription: string;
  variant?: "filled" | "outlined";
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  onClick?: () => void;
  className?: string;
}

export function ChronicleButton({
  inscription,
  variant = "filled",
  backgroundColor = "var(--bauhaus-chronicle-bg)",
  textColor = "var(--bauhaus-chronicle-fg)",
  hoverTextColor = "var(--bauhaus-chronicle-hover-fg)",
  borderColor,
  onClick,
  className = "",
}: ChronicleButtonProps) {
  const [hovered, setHovered] = useState(false);

  if (variant === "outlined") {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative overflow-hidden px-5 py-2 rounded-lg text-sm font-semibold border transition-colors duration-200 ${className}`}
        style={{
          borderColor: borderColor ?? backgroundColor,
          color: hovered ? hoverTextColor : textColor,
          backgroundColor: hovered ? backgroundColor : "transparent",
        }}
      >
        {inscription}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${className}`}
      style={{
        backgroundColor,
        color: textColor,
        opacity: hovered ? 0.88 : 1,
        transform: hovered ? "scale(0.97)" : "scale(1)",
      }}
    >
      {inscription}
    </button>
  );
}
