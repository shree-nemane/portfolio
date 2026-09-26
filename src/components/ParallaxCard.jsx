"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

/**
 * ParallaxCard (Client Component)
 * Provides physical mouse-tracking 3D-feel parallax float on project gallery cards.
 * Computes offset from normalized mouse position relative to card boundaries.
 */
export default function ParallaxCard({
  imageSrc,
  imageAlt = "",
  className = "",
  imgClassName = "object-cover",
  children,
  intensity = 12,
}) {
  const cardRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    setOffset({
      x: xRatio * -intensity,
      y: yRatio * -intensity,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden block ${className}`}
    >
      {/* Parallax inner image */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt || "Project preview"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          style={{
            transform: isHovered
              ? `scale(1.1) translate3d(${offset.x}px, ${offset.y}px, 0)`
              : "scale(1) translate3d(0, 0, 0)",
            transition: isHovered
              ? "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              : "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`w-full h-full block will-change-transform ${imgClassName}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-xs sm:text-sm uppercase tracking-widest text-neutral-300 font-medium p-4 text-center select-none">
          {imageAlt}
        </div>
      )}

      {/* Children such as overlay and badges */}
      {children}
    </div>
  );
}
