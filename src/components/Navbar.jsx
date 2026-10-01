"use client";

import React from "react";
import Link from "next/link";
import KineticText from "./KineticText";
import LocalTime from "./LocalTime";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", transitionLabel: "HOME" },
  { id: "work", label: "Work", href: "/work", transitionLabel: "WORK GALLERY" },
  { id: "services", label: "Services", href: "/services", transitionLabel: "SERVICES" },
  { id: "about", label: "About", href: "/about", transitionLabel: "ABOUT ME" },
  { id: "contact", label: "Contact", href: "mailto:shreenemane06@gmail.com" },
];

export const MOBILE_NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", transitionLabel: "HOME" },
  { id: "work", label: "Work", href: "/work", transitionLabel: "WORK GALLERY" },
  { id: "services", label: "Services", href: "/services", transitionLabel: "SERVICES" },
  { id: "about", label: "About", href: "/about", transitionLabel: "ABOUT ME" },
];

/**
 * MobileBottomNav (Option 2: Floating Bottom Navigation Pill)
 * High-contrast solid Swiss monochrome pill (strictly NO glassmorphism / no frosted glass effect).
 * Displayed exclusively on mobile screens (< 768px via md:hidden) for one-thumb page switching.
 */
export function MobileBottomNav({ theme = "dark", active = "" }) {
  const isLight = theme === "light";

  // Solid Swiss monochrome styling (no glassmorphic transparency/blur)
  const containerClasses = isLight
    ? "bg-neutral-900 text-white border border-neutral-800 shadow-2xl"
    : "bg-white text-neutral-900 border border-neutral-200 shadow-2xl";

  const dividerClass = isLight ? "text-neutral-700" : "text-neutral-300";
  const activeClass = isLight ? "text-white font-bold" : "text-neutral-950 font-bold";
  const inactiveClass = isLight
    ? "text-neutral-400 hover:text-white"
    : "text-neutral-500 hover:text-black";
  const bracketClass = isLight ? "text-neutral-500" : "text-neutral-400";

  return (
    <nav
      aria-label="Mobile Navigation"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden select-none px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-medium tracking-wider uppercase whitespace-nowrap min-h-[48px] ${containerClasses}`}
    >
      {MOBILE_NAV_ITEMS.map((item, idx) => {
        const isActive = active === item.id;
        return (
          <React.Fragment key={item.id}>
            {idx > 0 && (
              <span className={`${dividerClass} select-none font-light`}>/</span>
            )}
            {isActive ? (
              <span className={`${activeClass} inline-flex items-center justify-center gap-0.5 cursor-default min-h-[44px] px-2`}>
                <span className={`${bracketClass} font-mono`}>[</span>
                <span>{item.label}</span>
                <span className={`${bracketClass} font-mono`}>]</span>
              </span>
            ) : (
              <Link
                href={item.href}
                data-transition-label={item.transitionLabel}
                className={`${inactiveClass} transition-colors min-h-[44px] px-2 inline-flex items-center justify-center active:scale-95`}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/**
 * Navbar (Client Component)
 * Shared responsive top header across all portfolio routes.
 * Encapsulates dynamic local clock state, active route highlighting,
 * theme switching ('light' | 'dark'), hover kinetic character roll effects,
 * and renders the mobile bottom navigation pill for small viewports.
 */
export default function Navbar({
  theme = "dark",
  active = "",
  showHome,
  className = "w-full pt-4 sm:pt-6 px-4 sm:px-[2%] z-30 select-none",
}) {
  const isLight = theme === "light";
  const shouldShowItem = (item) => {
    if (item.id === "home") return showHome !== undefined ? showHome : active !== "home";
    return item.id !== active;
  };
  const items = NAV_ITEMS.filter(shouldShowItem);

  const brandColor = isLight ? "text-neutral-900" : "text-white";
  const navColor = isLight ? "text-neutral-500" : "text-neutral-400";
  const activeColor = isLight ? "text-neutral-900" : "text-white";
  const hoverColor = isLight ? "hover:text-neutral-900" : "hover:text-white";
  const dividerColor = isLight ? "text-neutral-300" : "text-neutral-700";
  const timeColor = isLight ? "text-neutral-500" : "text-neutral-400";

  const buttonClasses = isLight
    ? "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all duration-200 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-medium tracking-wide shadow-2xs hover:shadow-xs cursor-pointer inline-flex items-center"
    : "bg-white text-neutral-900 hover:bg-neutral-200 active:scale-95 transition-all duration-200 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-medium tracking-wide shadow-2xs hover:shadow-xs cursor-pointer inline-flex items-center";

  return (
    <>
      <header className={className}>
        <div className="w-full flex items-center justify-between">
          {/* Left col: Static Brandmark */}
          <div className="w-auto sm:w-[28%] flex items-center">
            <span className={`text-sm sm:text-base font-semibold tracking-tight ${brandColor} cursor-default`}>
              Let&apos;s Create
            </span>
          </div>

          {/* Time col at ~31% */}
          <div className="w-[20%] hidden lg:flex items-center">
            <LocalTime
              className={`text-xs sm:text-sm font-normal ${timeColor} tracking-normal tabular-nums`}
              title="Local time"
            />
          </div>

          {/* Navigation links at ~51% */}
          <div className="w-auto lg:w-[35%] hidden md:flex items-center">
            <nav className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${navColor} tracking-wide`}>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <span className={`${dividerColor} font-light`}>/</span>
                  )}
                  <Link
                    href={item.href}
                    data-transition-label={item.transitionLabel}
                    className={`${hoverColor} transition-colors duration-200 cursor-pointer group/link`}
                  >
                    <KineticText text={item.label} />
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Book a call button */}
          <div className="flex items-center justify-end">
            <a
              href="mailto:shreenemane06@gmail.com?subject=Project%20Inquiry"
              className={buttonClasses}
            >
            Book a call
            </a>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Pill on Mobile */}
      <MobileBottomNav theme={theme} active={active} />
    </>
  );
}
