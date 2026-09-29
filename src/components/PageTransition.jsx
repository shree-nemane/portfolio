"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * PageTransition
 * Coordinated dual-stage shutter wipe screen transitions.
 * Intercepts internal navigation links globally, animates closing shutters with
 * dynamic contextual route labels, dispatches Next.js router navigation, and smoothly
 * reveals the newly rendered route on path change.
 */

const PageTransitionContext = createContext({
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

function getLabelForPath(href) {
  if (!href) return "PAGE";
  const path = href.split("?")[0];
  if (path === "/" || path === "") return "HOME";
  if (path === "/work") return "WORK GALLERY";
  if (path.startsWith("/work/")) {
    const slug = path.replace("/work/", "");
    return slug.replace(/-/g, " ").toUpperCase();
  }
  return path.replace(/^\//, "").replace(/-/g, " ").toUpperCase() || "PAGE";
}

export function PageTransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef(null);
  const topBlockRef = useRef(null);
  const bottomBlockRef = useRef(null);
  const labelRef = useRef(null);

  const isTransitioningRef = useRef(false);
  const closeCompletedRef = useRef(false);
  const routeChangedRef = useRef(false);
  const currentPathRef = useRef(pathname);
  const fallbackTimerRef = useRef(null);
  const openTimerRef = useRef(null);

  // Open / Reverse Shutter Animation
  const openShutter = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    const topEl = topBlockRef.current;
    const bottomEl = bottomBlockRef.current;
    const overlay = overlayRef.current;

    if (!topEl || !bottomEl) {
      isTransitioningRef.current = false;
      return;
    }

    gsap.killTweensOf([topEl, bottomEl]);

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        closeCompletedRef.current = false;
        routeChangedRef.current = false;
        if (overlay) {
          overlay.style.pointerEvents = "none";
          overlay.style.visibility = "hidden";
        }
      },
    });

    tl.to(
      topEl,
      {
        yPercent: -100,
        duration: 0.38,
        ease: "power3.inOut",
      },
      0
    );

    tl.to(
      bottomEl,
      {
        yPercent: 100,
        duration: 0.38,
        ease: "power3.inOut",
      },
      0
    );
  }, []);

  // Trigger Navigation Sequence
  const navigateTo = useCallback(
    (href, label) => {
      if (isTransitioningRef.current) return;

      const cleanTarget = href.split("?")[0];
      const cleanCurrent = (pathname || "").split("?")[0];
      const currentFullUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : pathname;
      if (cleanTarget === cleanCurrent && href === currentFullUrl) {
        return; // Already on this exact page and search
      }

      // Clear any pending timers from previous navigations
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }

      isTransitioningRef.current = true;
      closeCompletedRef.current = false;
      routeChangedRef.current = false;

      const pageLabel = label || getLabelForPath(href);
      if (labelRef.current) {
        labelRef.current.textContent = pageLabel;
      }

      const overlay = overlayRef.current;
      const topEl = topBlockRef.current;
      const bottomEl = bottomBlockRef.current;

      if (overlay) {
        overlay.style.pointerEvents = "auto";
        overlay.style.visibility = "visible";
      }

      if (!topEl || !bottomEl) {
        router.push(href);
        return;
      }

      gsap.killTweensOf([topEl, bottomEl]);
      gsap.set(topEl, { yPercent: -100 });
      gsap.set(bottomEl, { yPercent: 100 });

      // Prefetch destination route immediately
      try {
        router.prefetch(href);
      } catch (_) {}

      // Phase 1: Blocks meet at the 50vh horizontal center seam
      const tl = gsap.timeline({
        onComplete: () => {
          closeCompletedRef.current = true;
          // Trigger the Next.js router change
          router.push(href, { scroll: true });

          // If route already changed or navigating within same base path (where pathname won't trigger useEffect)
          if (routeChangedRef.current || cleanTarget === cleanCurrent) {
            openTimerRef.current = setTimeout(() => {
              openShutter();
            }, 60);
          }
        },
      });

      tl.to(
        topEl,
        {
          yPercent: 0,
          duration: 0.38,
          ease: "power3.inOut",
        },
        0
      );

      tl.to(
        bottomEl,
        {
          yPercent: 0,
          duration: 0.38,
          ease: "power3.inOut",
        },
        0
      );

      // ponytail: Safety ceiling only for disconnected/failed network or browser aborts; normal loads resolve via pathname useEffect
      fallbackTimerRef.current = setTimeout(() => {
        if (isTransitioningRef.current) {
          openShutter();
        }
      }, 8000);
    },
    [router, pathname, openShutter]
  );

  // Watch for route changes to trigger the reverse/open animation
  useEffect(() => {
    currentPathRef.current = pathname;

    if (isTransitioningRef.current) {
      routeChangedRef.current = true;
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (closeCompletedRef.current) {
        // Small tick to ensure DOM has painted the new route
        openTimerRef.current = setTimeout(() => {
          openShutter();
        }, 60);
      }
    }
  }, [pathname, openShutter]);

  // Initial setup: ensure panels are parked off-screen and overlay hidden
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.style.visibility = "hidden";
    }
    if (topBlockRef.current && bottomBlockRef.current) {
      gsap.set(topBlockRef.current, { yPercent: -100 });
      gsap.set(bottomBlockRef.current, { yPercent: 100 });
    }
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  // Global click interception in capture phase for internal navigation links
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, hash, tel, mailto, new-tab, or download links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.getAttribute("download") !== null
      ) {
        return;
      }

      // Ignore modified clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // Handle internal relative routes
      if (href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) {
        const targetPath = href.split("?")[0];
        const currentPath = window.location.pathname;
        if (targetPath === currentPath) return;

        e.preventDefault();
        const customLabel =
          anchor.getAttribute("data-transition-label") || getLabelForPath(href);
        navigateTo(href, customLabel);
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, [navigateTo]);

  return (
    <PageTransitionContext.Provider value={{ navigateTo }}>
      {children}

      {/* Persistent Dual-Shutter Screen Curtain */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{ visibility: "hidden" }}
        className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none"
      >
        {/* Top Shutter Card (Slides down to 50vh) */}
        <div
          ref={topBlockRef}
          className="fixed top-0 left-0 right-0 h-[calc(50vh+1px)] bg-[#0c0c0c] text-white flex flex-col justify-end items-center pb-3 sm:pb-4 border-b border-white/[0.06] will-change-transform"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-neutral-400 uppercase select-none">
            MOVING TO
          </span>
        </div>

        {/* Bottom Shutter Card (Slides up to 50vh) */}
        <div
          ref={bottomBlockRef}
          className="fixed bottom-0 left-0 right-0 h-[calc(50vh+1px)] bg-[#0c0c0c] text-white flex flex-col justify-start items-center pt-3 sm:pt-4 border-t border-white/[0.06] will-change-transform"
        >
          <span
            ref={labelRef}
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase select-none text-center px-4"
          >
            PAGE
          </span>

          {/* 3-Bar Kinetic Rhythm Indicator at Bottom Right (Sharp Architectural / Swiss Mono) */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 flex items-end gap-1 h-8 pointer-events-none select-none"
          >
            <span className="rhythm-bar md:w-[12px] sm:w-[8px]" style={{ animationDelay: "0s" }} />
            <span className="rhythm-bar md:w-[12px] sm:w-[8px]" style={{ animationDelay: "0.18s" }} />
            <span className="rhythm-bar md:w-[12px] sm:w-[8px]" style={{ animationDelay: "0.36s" }} />
          </div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
