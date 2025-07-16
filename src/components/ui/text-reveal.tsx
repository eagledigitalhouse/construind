"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
  highlightWords?: string[];
  theme?: "light" | "dark";
  highlightColor?: string;
}

export const TextReveal: FC<TextRevealProps> = ({ children, className, highlightWords = [], theme = "light", highlightColor }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.2"]
  });

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string");
  }

  const words = children.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0", className)}>
      <div className="mx-auto flex items-center justify-center bg-transparent">
        <span className="flex flex-wrap justify-center text-center text-3xl sm:text-4xl md:text-5xl font-display font-extrabold leading-tight">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]} highlightWords={highlightWords} theme={theme} highlightColor={highlightColor}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  highlightWords?: string[];
  theme?: "light" | "dark";
  highlightColor?: string;
}

const Word: FC<WordProps> = ({ children, progress, range, highlightWords = [], theme = "light", highlightColor }) => {
  const opacity = useTransform(progress, range, [0.3, 1]);
  const wordString = children?.toString().toLowerCase() || "";
  const shouldHighlight = highlightWords.some(word => wordString.includes(word.toLowerCase()));
  
  // Definir cores baseadas no tema
  const getTextColor = () => {
    if (shouldHighlight) {
      if (highlightColor) {
        // Se a cor de destaque for "gradient", usar degradê
        if (highlightColor === "gradient") {
          return "bg-gradient-to-r from-[#0a2856] to-[#00d856] bg-clip-text text-transparent";
        }
        return highlightColor;
      }
      // Usar o degradê padrão para palavras destacadas
      return "bg-gradient-to-r from-[#00d856] to-[#b1f727] bg-clip-text text-transparent";
    }
    return theme === "dark" ? "text-white" : "text-[#0a2856]";
  };
  
  return (
    <span className="relative mx-1 lg:mx-1.5">
      <motion.span
        style={{ opacity: opacity }}
        className={getTextColor()}
      >
        {children}
      </motion.span>
    </span>
  );
}; 