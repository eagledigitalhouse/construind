"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg)");
  };

  return (
    <div
      className={cn(
        "relative group/pin z-10 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 top-1/2 flex justify-start items-start transition duration-700 overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-lg"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div className="pointer-events-none w-full h-full flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-7 flex-none inset-0">
        {/* Tooltip */}
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <a
            href={href}
            target={"_blank"}
            className="relative flex space-x-2 items-center z-10 rounded-full bg-[#0a2856] py-2 px-4 ring-1 ring-[#00d856]/20 shadow-lg"
          >
            <span className="relative z-20 text-white text-sm font-semibold inline-block">
              {title}
            </span>
            <span className="absolute -bottom-0 left-[1rem] h-px w-[calc(100%-2rem)] bg-gradient-to-r from-[#00d856]/0 via-[#00d856]/90 to-[#00d856]/0 transition-opacity duration-500"></span>
          </a>
        </div>

        {/* Linha vertical conectando tooltip ao card */}
        <div className="absolute top-8 left-1/2 w-px h-16 bg-gradient-to-b from-[#00d856] to-transparent transform -translate-x-1/2 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};