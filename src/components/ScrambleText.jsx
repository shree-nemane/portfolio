"use client";

import React, { useState, useRef, useEffect } from "react";

const GLYPHS = "!<>-_\\/[]{}*^?#01~=+:";

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
    if (!text || isHoveredRef.current) return;
    isHoveredRef.current = true;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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

      iteration += 1 / 2;

      if (iteration >= targetLength) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
      }
    }, speed);
  };

  const stopScramble = () => {
    isHoveredRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayText(text);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
