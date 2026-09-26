"use client";

import React, { useState, useRef, useEffect } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01~";

/**
 * ScrambleText (Client Component)
 * Tactile editorial ASCII glyph scramble on cursor hover.
 * Decodes characters progressively from left to right using monospaced typographical glyphs.
 */
export default function ScrambleText({
  text = "",
  className = "",
  as: Component = "span",
  speed = 28,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [prevText, setPrevText] = useState(text);
  const intervalRef = useRef(null);
  const isHoveredRef = useRef(false);

  if (text !== prevText) {
    setPrevText(text);
    setDisplayText(text);
  }

  const startScramble = () => {
    if (!text) return;
    isHoveredRef.current = true;
    clearInterval(intervalRef.current);

    let iteration = 0;
    const targetLength = text.length;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= targetLength) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }

      iteration += 1 / 2;
    }, speed);
  };

  const stopScramble = () => {
    isHoveredRef.current = false;
    clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Component
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      className={className}
      aria-label={text}
      {...props}
    >
      {displayText}
    </Component>
  );
}
