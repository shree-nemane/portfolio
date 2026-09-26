"use client";

import React, { useSyncExternalStore } from "react";
import { TransitionLink } from "./PageTransition";
import ScrambleText from "./ScrambleText";

function subscribeClock(callback) {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

function getClientTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${formattedMinutes}  ${ampm}`;
}

function getServerTime() {
  return "00:00 AM";
}

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", transitionLabel: "HOME" },
  { id: "work", label: "Work", href: "/work", transitionLabel: "WORK GALLERY" },
  { id: "services", label: "Services", href: "/services", transitionLabel: "SERVICES" },
  { id: "about", label: "About", href: "/about", transitionLabel: "ABOUT ME" },
  { id: "contact", label: "Contact", href: "mailto:contact@shreenemane06@gmail.com", isExternal: true },
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
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden select-none px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium tracking-wider uppercase whitespace-nowrap ${containerClasses}`}
    >
      {MOBILE_NAV_ITEMS.map((item, idx) => {
        const isActive = active === item.id;
        return (
          <React.Fragment key={item.id}>
            {idx > 0 && (
              <span className={`${dividerClass} select-none font-light`}>/</span>
            )}
            {isActive ? (
              <span className={`${activeClass} inline-flex items-center gap-0.5 cursor-default`}>
                <span className={`${bracketClass} font-mono`}>[</span>
                <span>{item.label}</span>
                <span className={`${bracketClass} font-mono`}>]</span>
              </span>
            ) : (
              <TransitionLink
                href={item.href}
                label={item.transitionLabel}
                className={`${inactiveClass} transition-colors px-1 py-0.5 active:scale-95`}
              >
                {item.label}
              </TransitionLink>
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
 * theme switching ('light' | 'dark'), hover ASCII character scramble effects,
 * and renders the mobile bottom navigation pill for small viewports.
 */
export default function Navbar({
  theme = "dark",
  active = "",
  showHome,
  className = "w-full pt-4 sm:pt-6 px-4 sm:px-[2%] z-30 select-none",
}) {
  const timeStr = useSyncExternalStore(subscribeClock, getClientTime, getServerTime);

  const isLight = theme === "light";
  const shouldShowHome = showHome !== undefined ? showHome : active !== "home";
  const items = NAV_ITEMS.filter((item) => (item.id === "home" ? shouldShowHome : true));

  const brandColor = isLight
    ? "text-neutral-900 hover:text-neutral-600"
    : "text-white hover:text-neutral-300";
  const navColor = isLight ? "text-neutral-500" : "text-neutral-400";
  const activeColor = isLight ? "text-neutral-900" : "text-white";
  const hoverColor = isLight ? "hover:text-neutral-900" : "hover:text-white";
  const dividerColor = isLight ? "text-neutral-300" : "text-neutral-700";

  const buttonClasses = isLight
    ? "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all duration-200 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-medium tracking-wide shadow-2xs hover:shadow-xs cursor-pointer inline-flex items-center"
    : "bg-white text-neutral-900 hover:bg-neutral-200 active:scale-95 transition-all duration-200 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-medium tracking-wide shadow-2xs hover:shadow-xs cursor-pointer inline-flex items-center";

  return (
    <>
      <header className={className}>
        <div className="w-full flex items-center justify-between">
          {/* Left col: Brandmark / Home */}
          <div className="w-auto sm:w-[28%] flex items-center">
            {active === "home" ? (
              <span className={`text-sm sm:text-base font-semibold tracking-tight ${brandColor} cursor-default`}>
                <ScrambleText text="Let's Create" />
              </span>
            ) : (
              <TransitionLink
                href="/"
                label="HOME"
                className={`text-sm sm:text-base font-semibold tracking-tight ${brandColor} transition-colors cursor-pointer`}
              >
                <ScrambleText text="Let's Create" />
              </TransitionLink>
            )}
          </div>

          {/* Time col at ~31% */}
          <div className="w-[20%] hidden lg:flex items-center">
            <span
              className="text-xs sm:text-sm font-normal text-neutral-400 tracking-normal tabular-nums"
              title="Local time"
            >
              {timeStr}
            </span>
          </div>

          {/* Navigation links at ~51% */}
          <div className="w-auto lg:w-[35%] hidden md:flex items-center">
            <nav className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${navColor} tracking-wide`}>
              {items.map((item, index) => {
                const isActive = active === item.id;
                return (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <span className={`${dividerColor} font-light`}>/</span>
                    )}
                    {isActive ? (
                      <span className={`${activeColor} cursor-default font-medium`}>
                        <ScrambleText text={item.label} />
                      </span>
                    ) : item.isExternal ? (
                      <a
                        href={item.href}
                        className={`${hoverColor} transition-colors duration-200 cursor-pointer`}
                      >
                        <ScrambleText text={item.label} />
                      </a>
                    ) : (
                      <TransitionLink
                        href={item.href}
                        label={item.transitionLabel}
                        className={`${hoverColor} transition-colors duration-200 cursor-pointer`}
                      >
                        <ScrambleText text={item.label} />
                      </TransitionLink>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Book a call button */}
          <div className="flex items-center justify-end">
            <a
              href="mailto:contact@shreenemane06@gmail.com?subject=Project%20Inquiry"
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
