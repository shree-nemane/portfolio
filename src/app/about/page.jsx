"use client";

import React, { useSyncExternalStore, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { TransitionLink } from "../../components/PageTransition";
import ScrambleText from "../../components/ScrambleText";
import { MobileBottomNav } from "../../components/Navbar";

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
  return `${hours}:${formattedMinutes} ${ampm}`;
}

function getServerTime() {
  return "19:06 PM";
}

const SMUDGE_CONFIG = {
  smoothing: 0.1,
  movementThreshold: 0.01,
  sizeFromSpeed: 0.2,
  expandMultiplier: 2,
  expandTime: 2,
  expandEase: "power1.out",
  dissolveStart: 2,
  dissolveTime: 3,
  dissolveEase: "power3.in",
};

/**
 * AboutPage
 * Full-viewport continuous horizontal editorial experience comprising 4 sections:
 *  1. Hero: Monumental typography & lights-off trigger
 *  2. "Make sense ?": Stagnant headline alongside vertical gliding opinion list
 *  3. Smudge Revealer: Interactive cursor-driven liquid mask
 *  4. Outro: Minimalist typographic resolution
 *
 * Coordinates horizontal scroll tracks and vertical inner column scroll via
 * a unified 1D inertial smooth scroll RAF coordinator.
 */
export default function AboutPage() {
  const timeStr = useSyncExternalStore(subscribeClock, getClientTime, getServerTime);
  const containerRef = useRef(null);
  const leftScrollRef = useRef(null);
  const section2Ref = useRef(null);
  const scrollPosRef = useRef({ current: 0, target: 0 });
  const rafIdRef = useRef(null);
  const startAnimationRef = useRef(null);
  const heroRef = useRef(null);
  const smudgeSvgRef = useRef(null);
  const smudgeContainerRef = useRef(null);

  // Inertial smooth scroll coordinator (RAF + LERP interpolation):
  // Eliminates harsh notch jumps and abruptly stopping at boundaries.
  // 1. Unified 1D virtual scroll track: Horizontal -> Section 2 vertical -> Forward
  // 2. Linear interpolation (0.09 factor) for buttery ease-out deceleration
  // 3. Velocity dampening (0.65 factor) to prevent rushing through content
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    scrollPosRef.current = {
      current: el.scrollLeft,
      target: el.scrollLeft,
    };

    const applyScroll = (pos) => {
      const leftScroll = leftScrollRef.current;
      const section2El = section2Ref.current;
      const startOffset = section2El ? section2El.offsetLeft : el.clientWidth;
      const maxScrollY = leftScroll
        ? Math.max(0, leftScroll.scrollHeight - leftScroll.clientHeight)
        : 0;

      if (pos <= startOffset) {
        // Sections before Section 2 -> horizontal scroll
        el.scrollLeft = pos;
        if (leftScroll) leftScroll.scrollTop = 0;
      } else if (pos <= startOffset + maxScrollY) {
        // Inside Section 2 -> vertical glide through left column
        el.scrollLeft = startOffset;
        if (leftScroll) leftScroll.scrollTop = pos - startOffset;
      } else {
        // Past Section 2 -> continue horizontally
        el.scrollLeft = startOffset + (pos - (startOffset + maxScrollY));
        if (leftScroll) leftScroll.scrollTop = maxScrollY;
      }
    };

    const tick = () => {
      const { current, target } = scrollPosRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.8) {
        scrollPosRef.current.current = target;
        applyScroll(target);
        rafIdRef.current = null;
        return;
      }

      // 0.15 easing factor delivers snappy, zero-lag physical response with smooth deceleration
      const next = current + diff * 0.15;
      scrollPosRef.current.current = next;
      applyScroll(next);

      rafIdRef.current = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };
    startAnimationRef.current = startAnimation;

    const onWheel = (e) => {
      // Don't hijack browser pinch-zoom
      if (e.ctrlKey) return;

      const leftScroll = leftScrollRef.current;
      const rawDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(rawDelta) < 0.5) return;

      e.preventDefault();

      // Normalize line-scroll vs pixel-scroll
      const baseDelta =
        e.deltaMode === 1
          ? rawDelta * 24
          : e.deltaMode === 2
            ? rawDelta * window.innerHeight * 0.5
            : rawDelta;

      const delta = baseDelta * 0.8;

      const maxScrollY = leftScroll
        ? Math.max(0, leftScroll.scrollHeight - leftScroll.clientHeight)
        : 0;
      const maxScrollX = Math.max(0, el.scrollWidth - el.clientWidth);
      const totalDistance = maxScrollX + maxScrollY;

      scrollPosRef.current.target = Math.max(
        0,
        Math.min(totalDistance, scrollPosRef.current.target + delta)
      );

      startAnimation();
    };

    const onKeyDown = (e) => {
      const leftScroll = leftScrollRef.current;
      const maxScrollY = leftScroll
        ? Math.max(0, leftScroll.scrollHeight - leftScroll.clientHeight)
        : 0;
      const maxScrollX = Math.max(0, el.scrollWidth - el.clientWidth);
      const totalDistance = maxScrollX + maxScrollY;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        scrollPosRef.current.target = Math.min(
          totalDistance,
          scrollPosRef.current.target + 200
        );
        startAnimation();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollPosRef.current.target = Math.max(0, scrollPosRef.current.target - 200);
        startAnimation();
      }
    };

    const onResize = () => {
      const maxScrollY = leftScrollRef.current
        ? Math.max(0, leftScrollRef.current.scrollHeight - leftScrollRef.current.clientHeight)
        : 0;
      const maxScrollX = Math.max(0, el.scrollWidth - el.clientWidth);
      const totalDistance = maxScrollX + maxScrollY;

      scrollPosRef.current.target = Math.min(scrollPosRef.current.target, totalDistance);
      scrollPosRef.current.current = Math.min(scrollPosRef.current.current, totalDistance);
      applyScroll(scrollPosRef.current.current);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const scrollToSection2 = () => {
    if (containerRef.current) {
      const sectionWidth = containerRef.current.clientWidth;
      scrollPosRef.current.target = sectionWidth;
      startAnimationRef.current?.();
    }
  };

  useEffect(() => {
    const heroSection = heroRef.current || document.querySelector(".hero");
    const smudgeSVG = smudgeSvgRef.current || document.querySelector(".smudge-revealer");
    const smudgeContainer = smudgeContainerRef.current || document.querySelector(".smudge-blobs");

    if (!heroSection || !smudgeContainer) return;

    const pointer = { x: 0, y: 0 };
    const smoothPointer = { x: 0, y: 0 };
    let hasStarted = false;

    function onPointerMove(x, y) {
      if (!hasStarted) {
        pointer.x = smoothPointer.x = x;
        pointer.y = smoothPointer.y = y;
        hasStarted = true;
        return;
      }

      pointer.x = x;
      pointer.y = y;
    }

    const onMouseMove = function (e) {
      onPointerMove(e.pageX, e.pageY);
    };

    const onTouchStart = function (e) {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
      }
    };

    const onTouchMove = function (e) {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
      }
    };

    heroSection.addEventListener("mousemove", onMouseMove);
    heroSection.addEventListener("touchstart", onTouchStart, { passive: true });
    heroSection.addEventListener("touchmove", onTouchMove, { passive: true });

    function matchSVGToViewport() {
      if (smudgeSVG) {
        smudgeSVG.style.width = window.innerWidth + "px";
        smudgeSVG.style.height = window.innerHeight + "px";
      }
    }

    matchSVGToViewport();
    window.addEventListener("resize", matchSVGToViewport);

    function stampSmudgeAt(x, y, radius) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", "#fff");

      smudgeContainer.prepend(circle);

      const animatedRadius = { current: radius };

      const timeline = gsap.timeline({
        onUpdate() {
          circle.setAttribute("r", Math.max(0, animatedRadius.current));
        },
        onComplete() {
          timeline.kill();
          circle.remove();
        },
      });

      timeline.to(animatedRadius, {
        current: radius * SMUDGE_CONFIG.expandMultiplier,
        duration: SMUDGE_CONFIG.expandTime,
        ease: SMUDGE_CONFIG.expandEase,
      });

      timeline.to(
        animatedRadius,
        {
          current: 0,
          duration: SMUDGE_CONFIG.dissolveTime,
          ease: SMUDGE_CONFIG.dissolveEase,
        },
        SMUDGE_CONFIG.dissolveStart
      );
    }

    let rafId;
    function update() {
      if (hasStarted) {
        smoothPointer.x += (pointer.x - smoothPointer.x) * SMUDGE_CONFIG.smoothing;
        smoothPointer.y += (pointer.y - smoothPointer.y) * SMUDGE_CONFIG.smoothing;

        const speed = Math.hypot(
          pointer.x - smoothPointer.x,
          pointer.y - smoothPointer.y
        );

        if (speed > SMUDGE_CONFIG.movementThreshold) {
          stampSmudgeAt(
            smoothPointer.x,
            smoothPointer.y,
            speed * SMUDGE_CONFIG.sizeFromSpeed
          );
        }
      }

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", matchSVGToViewport);
      heroSection.removeEventListener("mousemove", onMouseMove);
      heroSection.removeEventListener("touchstart", onTouchStart);
      heroSection.removeEventListener("touchmove", onTouchMove);
      if (rafId) cancelAnimationFrame(rafId);
      while (smudgeContainer.firstChild) {
        smudgeContainer.removeChild(smudgeContainer.firstChild);
      }
    };
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white text-black selection:bg-black selection:text-white">
      {/* ================= FIXED NAVBAR: ONLY HOME IN TOP LEFT ================= */}
      <nav className="fixed top-4 sm:top-5 left-4 sm:left-12 z-1000 select-none">
        <TransitionLink
          href="/"
          label="HOME"
          className="hidden  lg:inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-neutral-700  uppercase cursor-pointer"
        >
          <span className="text-black text-lg">&#91; </span>
          <span className="hover:opacity-60 transition-opacity">←</span>
          <ScrambleText className="hover:opacity-60 transition-opacity" text="HOME" />
          <span className="text-black text-lg"> &#93;</span>
        </TransitionLink>
      </nav>

      {/* Floating Bottom Navigation Pill on Mobile */}
      <MobileBottomNav theme="light" active="about" />

      {/* ================= HORIZONTAL CONTINUOUS SCROLL CONTAINER ================= */}
      <div
        ref={containerRef}
        className="relative h-screen w-screen overflow-x-auto overflow-y-hidden flex flex-row select-none no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ----------------- SECTION 1: HERO (01) ----------------- */}
        <section className="relative h-screen w-screen shrink-0 flex flex-col justify-between p-5 sm:p-10 lg:p-8 bg-white">
          {/* Top Info Bar */}
          <div className="w-full flex items-center justify-end z-20">
            <div className="flex items-center gap-3 sm:gap-8">
              <span
                className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-neutral-800 uppercase cursor-default"
              >
                A LITTLE RUN THROUGH MY MIND
              </span>
              <div className="bg-black text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-sm text-[11px] sm:text-xs font-mono font-medium tracking-wider">
                {timeStr}
              </div>
            </div>
          </div>

          {/* Left Indicator */}
          <div className="hidden lg:block absolute left-10 lg:left-12 top-[42%] text-[11px] font-mono tracking-widest text-neutral-600">
            HORIZONTAL SCROLL →
          </div>

          {/* Center Main Stage Typography */}
          <div className="relative my-auto flex flex-col items-center justify-center text-center py-6 sm:py-8 z-10">
            {/* Floating graphic circle above-right */}
            <div className="absolute -top-6 sm:-top-10 right-[15%] sm:right-[22%] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black " />

            {/* Small label above headline */}
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-neutral-800 uppercase cursor-default">
              SN
            </span>

            {/* Giant Monumental Headline with Masked Slide-Up */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] font-black tracking-tight leading-[0.88] text-black uppercase">
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:80ms]">
                  MULTI–
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:200ms]">
                  DISCIPLINED <span className="hidden sm:inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:320ms]">
                  <span className="hidden sm:inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> DEVELOPER
                </span>
              </span>
            </h1>

            {/* Right Slogan */}
            <div className="w-full max-w-6xl flex justify-end mt-4 sm:mt-6 pr-4">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-neutral-800 uppercase cursor-default">
                GOOD DESIGN IS HONEST
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex items-center justify-between z-20 pt-4">
            <div className="w-24">
              <ScrambleText
                text="Keep going"
                className="text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-400 uppercase cursor-pointer hover:text-black transition-colors"
              />
            </div>

            {/* Advance to next section */}
            <button
              type="button"
              onClick={scrollToSection2}
              aria-label="Scroll to next section"
              className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black hover:bg-black transition-colors cursor-pointer"
            >
              <span className="text-sm sm:text-base group-hover:text-white transition-colors group-hover:translate-x-0.5 transform duration-200">
                →
              </span>
            </button>

            <div className="flex justify-end"></div>
            <div className="absolute right-[15%] sm:right-[11%] w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-black " />
          </div>
        </section>

        <section className="relative h-screen w-screen shrink-0 flex flex-col justify-between overflow-hidden">
          <Image
            src="/intro-book.webp"
            alt="Hero Image"
            width={1920} height={1080}
            className="w-full h-full object-cover"
          />
        </section>

        {/* ----------------- SECTION 2: THINGS THAT DON'T MAKE SENSE ----------------- */}
        <section
          ref={section2Ref}
          className="relative h-screen w-screen shrink-0 border-l border-neutral-200 bg-white text-black p-5 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden"
        >
          {/* Top Bar: Name + Stacked Index/Approach */}
          <div className="pt-16 sm:pt-28 lg:pt-40 flex-1 min-h-0 flex flex-col">
            <div className="w-full flex items-start justify-between z-20 shrink-0 pb-4 ">
              <div className="flex items-start gap-8 sm:gap-20 pt-1">
                <span className="text-base sm:text-lg font-medium tracking-tight text-black">
                  Shree Nemane
                </span>

                <div className="flex flex-col text-xs sm:text-sm font-normal text-black leading-tight">
                  <span>Index</span>
                  <span>Approach</span>
                </div>
              </div>
            </div>

            {/* Main Stage: Left scrollable column + Right stagnant title */}
            <div className="relative w-full flex-1 min-h-0 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12 overflow-hidden">
              {/* Left Part: Scrollable Steps (01, 02, 03 - opinions and personal observations) */}
              <div
                ref={leftScrollRef}
                className="w-full lg:w-[56%] h-full overflow-y-auto no-scrollbar pr-4 sm:pr-8 lg:pr-12"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* Mobile title */}
                <div className="lg:hidden shrink-0 text-left select-none pb-8">
                  <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-black leading-[0.95]">
                    Things that don&apos;t make sense
                  </h2>
                </div>

                <div className="flex flex-col gap-12 sm:gap-20 lg:gap-28 pt-4 pb-28 sm:pb-48">
                  {/* Step 01: Modern Complexity */}
                  <div className="flex items-start gap-6 sm:gap-14">
                    <span className="text-2xl sm:text-4xl lg:text-6xl font-medium tracking-tight text-black shrink-0 w-10 sm:w-20">
                      01
                    </span>
                    <div className="flex flex-col gap-3 max-w-xl">
                      <h3 className="text-2xl sm:text-4xl lg:text-6xl font-medium tracking-tight text-black leading-tight">
                        Complexity of Thinking
                      </h3>
                      <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                        We ship megabytes of JavaScript to render static text that basic HTML solved decades ago. Modern web engineering has developed an obsession with architectural ceremonies—wrapping simple concepts in recursive layers of indirection under the guise of future-proofing, before validating if anyone actually needs it.
                      </p>
                    </div>
                  </div>

                  {/* Step 02: Sterile Uniformity */}
                  <div className="flex items-start gap-6 sm:gap-14">
                    <span className="text-2xl sm:text-4xl lg:text-6xl font-medium tracking-tight text-black shrink-0 w-10 sm:w-20">
                      02
                    </span>
                    <div className="flex flex-col gap-3 max-w-xl">
                      <h3 className="text-2xl sm:text-4xl lg:text-6xl font-medium tracking-tight text-black leading-tight">
                        Sterile Uniformity
                      </h3>
                      <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                        Every digital product now uses the same rounded cards, the same muted gray palette, and the same safe typography. In chasing frictionless usability and design system dogmatism, we have engineered personality and human soul out of the web. Good design is opinionated, not an aggregate of market averages.
                      </p>
                    </div>
                  </div>

                  {/* Step 03: Invisible Craft */}
                  <div className="flex items-start gap-6 sm:gap-14">
                    <span className="text-2xl sm:text-4xl lg:text-6xl font-medium tracking-tight text-black shrink-0 w-10 sm:w-20">
                      03
                    </span>
                    <div className="flex flex-col gap-3 max-w-xl">
                      <h3 className="text-2xl sm:text-4xl lg:text-6xl font-medium tracking-tight text-black leading-tight">
                        Invisible Craft
                      </h3>
                      <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                        Obsessing over invisible bezier curves and 60fps micro-delights while the app takes four seconds to load over mobile networks. The highest form of luxury in software isn&apos;t decorative flair—it is instantaneous responsiveness, predictability, and honest restraint.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          {/* Right Part: Stagnant Title (Desktop) */}
          <div className="absolute top-10 right-10 hidden lg:flex w-[44%] shrink-0 justify-end text-right select-none pointer-events-none self-start">
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem] font-medium tracking-tight text-black leading-[0.92]">
              Thoughts
            </h2>
          </div>

          {/* Clean minimal spacer bottom */}
          <div className="w-full h-4 shrink-0" />
        </section>

        {/* ----------------- SECTION 3: Smudge Revealer ----------------- */}
        <section
          ref={heroRef}
          className="hero relative h-screen w-screen shrink-0 border-l border-neutral-200 overflow-hidden"
        >
          <div className="absolute bg-white top-0 left-0 w-full h-full text-center flex flex-col items-center justify-center select-none p-6 sm:p-12">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-neutral-500 uppercase mb-4 sm:mb-6">
              [ CAUTION ]
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-black uppercase leading-[0.92]">
              Do not wipe<br />this screen.
            </h2>
          </div>

          <div
            style={{ mask: "url(#smudge-mask)", WebkitMask: "url(#smudge-mask)" }}
            className="absolute bg-black text-white top-0 left-0 w-full h-full text-center flex flex-col justify-center items-center select-none p-6 sm:p-12"
          >
            <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl flex flex-col items-center gap-4 sm:gap-6">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-neutral-400 uppercase">
                [ CURIOSITY CONFIRMED ]
              </span>
              <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-snug sm:leading-tight">
                Told you so. Curiosity is the prerequisite for good engineering. Since you took the effort to scrub all this way, let&apos;s build something together.
              </p>
            </div>
          </div>

          <svg
            ref={smudgeSvgRef}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="smudge-revealer absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <defs>
              <filter id="smudge-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -14"
                />
              </filter>
            </defs>
            <mask id="smudge-mask">
              <g ref={smudgeContainerRef} className="smudge-blobs" filter="url(#smudge-goo)" />
            </mask>
          </svg>
        </section>

        {/* ----------------- SECTION 4: OUTRO ----------------- */}
        <section className="relative h-screen w-screen shrink-0 border-l border-neutral-200 bg-white text-black flex items-center justify-center p-6 sm:p-12 overflow-hidden select-none">
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight [word-spacing:0.5rem] sm:[word-spacing:1rem] uppercase text-black text-center">
            <span className="block overflow-hidden">
              <span className="inline-block animate-mask-slide-up [animation-delay:150ms]">
                its done bro
              </span>
            </span>
          </h2>
        </section>

      </div>
    </main>
  );
}
