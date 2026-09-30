"use client";

import React, { useMemo } from "react";

/**
 * Segments text into grapheme clusters where supported,
 * with a graceful Array.from() code-point fallback.
 */
function getGraphemes(text) {
  if (!text) return [];
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (entry) => entry.segment);
  }
  return Array.from(text);
}

/**
 * KineticText (Client Component)
 * Swiss editorial staggered vertical character roll.
 * Pure CSS transforms on hover and focus-visible; accessible screen-reader support.
 */
export default function KineticText({
  text = "",
  className = "",
  as: Component = "span",
  staggerMs = 18,
  ...props
}) {
  const characters = useMemo(() => getGraphemes(text), [text]);

  if (!text) return null;

  return (
    <Component
      className={`kinetic-root relative inline-flex overflow-hidden select-none ${className}`.trim()}
      {...props}
    >
      {/* Screen-reader accessible plain text */}
      <span className="sr-only">{text}</span>

      {/* Visual character animation isolated from the accessibility tree */}
      <span aria-hidden="true" className="inline-flex overflow-hidden">
        {characters.map((char, index) => {
          if (char === " ") {
            return (
              <span key={index} className="inline-block">
                &nbsp;
              </span>
            );
          }

          return (
            <span
              key={index}
              className="relative inline-block overflow-hidden leading-none"
            >
              {/* Primary character */}
              <span
                className="kinetic-char-primary"
                style={{
                  transitionDelay: `${index * staggerMs}ms`,
                }}
              >
                {char}
              </span>

              {/* Duplicate character */}
              <span
                className="kinetic-char-duplicate"
                style={{
                  transitionDelay: `${index * staggerMs}ms`,
                }}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    </Component>
  );
}
