import React from "react";
import { cn } from "@/lib/utils";

interface GlassChipProps {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  theme?: "light" | "dark";
  icon?: React.ReactNode;
}

export const GlassChip: React.FC<GlassChipProps> = ({ 
  children, 
  className = "", 
  delay = "0.1s",
  theme = "light",
  icon
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center px-4 py-2 rounded-xl",
    "backdrop-blur-sm border shadow-lg opacity-0 animate-fade-in",
    "text-xs font-semibold uppercase tracking-wide",
    "transition-all duration-300 hover:scale-105"
  );
  
  const themeClasses = theme === "dark" 
    ? "bg-gray-800/40 border-gray-600/30 text-gray-200 hover:bg-gray-700/50"
    : "bg-gray-200/60 border-gray-300/40 text-gray-700 hover:bg-gray-300/70";

  return (
    <div 
      className={cn(baseClasses, themeClasses, className)}
      style={{
        animationDelay: delay
      }}
    >
      {icon && (
        <span className="mr-2 flex items-center">
          {icon}
        </span>
      )}
      <span className="font-bold">
        {children}
      </span>
    </div>
  );
}; 