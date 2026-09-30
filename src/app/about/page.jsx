"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import KineticText from "../../components/KineticText";
import { MobileBottomNav } from "../../components/Navbar";
import LocalTime from "../../components/LocalTime";

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
  const containerRef = useRef(null);
  const driverRef = useRef(null);
  const spacerRef = useRef(null);
  const metricsRef = useRef({ section2Start: 0, innerMaxY: 0, maxScrollX: 0, totalDistance: 0 });
  const leftScrollRef = useRef(null);
  const section2Ref = useRef(null);
  const bookSectionRef = useRef(null);
  const heroRef = useRef(null);
  const smudgeSvgRef = useRef(null);
  const smudgeContainerRef = useRef(null);

  // Native scroll driver: the browser owns vertical scroll position. On desktop,
  // the horizontal track is sticky and its transform is derived from scroll progress.
  useEffect(() => {
    const driver = driverRef.current;
    const track = containerRef.current;
    const spacer = spacerRef.current;
    const inner = leftScrollRef.current;
    const section2 = section2Ref.current;
    if (!driver || !track || !spacer || !inner || !section2) return;

    let desktop = window.innerWidth >= 1024;
    let measureRaf = 0;

    const measure = () => {
      measureRaf = 0;
      desktop = window.innerWidth >= 1024;
      if (!desktop) {
        track.style.transform = "none";
        spacer.style.height = "0px";
        inner.style.overflowY = "visible";
        inner.style.removeProperty("height");
        inner.style.removeProperty("overflow-y");
        inner.scrollTop = 0;
        return;
      }

      // Read geometry only during invalidation, never in the scroll handler.
      const viewportWidth = driver.clientWidth;
      const contentWidth = track.scrollWidth;
      const maxScrollX = Math.max(0, contentWidth - viewportWidth);
      const section2Start = Math.max(0, section2.offsetLeft);

      inner.style.overflowY = "hidden";
      const innerMaxY = Math.max(0, inner.scrollHeight - inner.clientHeight);
      const totalDistance = maxScrollX + innerMaxY;

      metricsRef.current = { section2Start, innerMaxY, maxScrollX, totalDistance };
      spacer.style.height = `${totalDistance}px`;
      updateFromScroll();
    };

    const updateFromScroll = () => {
      if (!desktop) return;
      const { section2Start, innerMaxY, maxScrollX, totalDistance } = metricsRef.current;
      const distance = Math.max(0, Math.min(totalDistance, driver.scrollTop));
      const before = Math.min(distance, section2Start);
      const inside = Math.max(0, Math.min(innerMaxY, distance - section2Start));
      const after = Math.max(0, distance - section2Start - innerMaxY);
      const x = Math.min(maxScrollX, before + after);

      track.style.transform = `translate3d(${-x}px, 0, 0)`;
      inner.scrollTop = inside;
    };

    const scheduleMeasure = () => {
      if (!measureRaf) measureRaf = requestAnimationFrame(measure);
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;
    const previousTouchAction = track.style.touchAction;
    track.style.touchAction = "pan-y";
    const onPointerDown = (event) => {
      if (!desktop || event.pointerType !== "touch") return;
      touchStartX = event.clientX;
      touchStartY = event.clientY;
      touchActive = true;
    };
    const onPointerMove = (event) => {
      if (!touchActive || event.pointerType !== "touch" || !desktop) return;
      const dx = event.clientX - touchStartX;
      const dy = event.clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        event.preventDefault();
        driver.scrollTop += -dx;
        touchStartX = event.clientX;
        touchStartY = event.clientY;
      }
    };
    const onPointerEnd = () => { touchActive = false; };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove, { passive: false });
    track.addEventListener("pointerup", onPointerEnd);
    track.addEventListener("pointercancel", onPointerEnd);
    driver.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(track);
    observer.observe(inner);
    observer.observe(section2);
    scheduleMeasure();

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerEnd);
      track.removeEventListener("pointercancel", onPointerEnd);
      track.style.touchAction = previousTouchAction;
      driver.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", scheduleMeasure);
      observer.disconnect();
      if (measureRaf) cancelAnimationFrame(measureRaf);
    };
  }, []);

  const scrollToSection2 = () => {
    const driver = driverRef.current;
    if (driver && window.innerWidth >= 1024) {
      const { section2Start } = metricsRef.current;
      driver.scrollTo({ top: section2Start, behavior: "smooth" });
    } else {
      (bookSectionRef.current || section2Ref.current)?.scrollIntoView({ behavior: "smooth" });
    }
  };


useEffect(() => {
  const heroSection =
    heroRef.current || document.querySelector(".hero");

  const smudgeSVG =
    smudgeSvgRef.current ||
    document.querySelector(".smudge-revealer");

  const smudgeContainer =
    smudgeContainerRef.current ||
    document.querySelector(".smudge-blobs");

  if (!heroSection || !smudgeContainer) return;

  // --------------------------------------------------
  // CONFIGURATION
  // --------------------------------------------------

  const SVG_NS = "http://www.w3.org/2000/svg";

  // Hard limit prevents unlimited SVG nodes during
  // prolonged or unusually fast pointer movement.
  const MAX_ACTIVE_STAMPS = 180;

  // A single animation coordinator manages every stamp.
  const activeStamps = [];

  const pointer = { x: 0, y: 0 };
  const smoothPointer = { x: 0, y: 0 };

  let hasStarted = false;
  let isLoopRunning = false;
  let rafId = null;
  let isDestroyed = false;

  // --------------------------------------------------
  // SVG SIZE
  // --------------------------------------------------

  function matchSVGToViewport() {
    if (!smudgeSVG || !heroSection) return;

    smudgeSVG.style.width =
      `${heroSection.clientWidth}px`;

    smudgeSVG.style.height =
      `${heroSection.clientHeight}px`;
  }

  matchSVGToViewport();

  // ResizeObserver also catches size changes caused by
  // layout changes, not just browser-window resizing.
  const resizeObserver = new ResizeObserver(() => {
    matchSVGToViewport();
  });

  resizeObserver.observe(heroSection);

  // --------------------------------------------------
  // POINTER INPUT
  // --------------------------------------------------

  function updatePointer(clientX, clientY) {
    if (isDestroyed) return;

    const rect = heroSection.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!hasStarted) {
      pointer.x = smoothPointer.x = x;
      pointer.y = smoothPointer.y = y;
      hasStarted = true;
    } else {
      pointer.x = x;
      pointer.y = y;
    }

    requestSmudgeUpdate();
  }

  function onPointerMove(event) {
    // Ignore non-primary mouse buttons.
    if (
      event.pointerType === "mouse" &&
      event.buttons !== 0 &&
      event.buttons !== 1
    ) {
      return;
    }

    updatePointer(event.clientX, event.clientY);
  }

  heroSection.addEventListener(
    "pointermove",
    onPointerMove,
    { passive: true }
  );

  // --------------------------------------------------
  // STAMP CREATION
  // --------------------------------------------------

  function stampSmudgeAt(x, y, radius) {
    if (isDestroyed || radius <= 0) return;

    const circle = document.createElementNS(
      SVG_NS,
      "circle"
    );

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "#fff");

    smudgeContainer.prepend(circle);

    const now = performance.now();

    const stamp = {
      element: circle,
      x,
      y,
      initialRadius: radius,
      startTime: now,
    };

    activeStamps.push(stamp);

    // Remove the oldest stamp if we hit the safety cap.
    if (activeStamps.length > MAX_ACTIVE_STAMPS) {
      const oldest = activeStamps.shift();

      oldest?.element.remove();
    }
  }

  // --------------------------------------------------
  // CENTRALIZED STAMP ANIMATION
  // --------------------------------------------------

  function updateActiveStamps(now) {
    const expandDuration =
      SMUDGE_CONFIG.expandTime * 1000;

    const dissolveDuration =
      SMUDGE_CONFIG.dissolveTime * 1000;

    const dissolveStart =
      SMUDGE_CONFIG.dissolveStart * 1000;

    const totalDuration = Math.max(
      expandDuration,
      dissolveStart + dissolveDuration
    );

    for (let i = activeStamps.length - 1; i >= 0; i--) {
      const stamp = activeStamps[i];

      const elapsed = now - stamp.startTime;

      if (elapsed >= totalDuration) {
        stamp.element.remove();
        activeStamps.splice(i, 1);
        continue;
      }

      const initialRadius = stamp.initialRadius;

      let radius = initialRadius;

      // ----------------------------------------------
      // EXPANSION
      // Equivalent to GSAP power1.out
      // ----------------------------------------------

      if (elapsed < expandDuration) {
        const progress = Math.min(
          elapsed / expandDuration,
          1
        );

        const eased =
          1 - Math.pow(1 - progress, 2);

        radius =
          initialRadius +
          (
            initialRadius *
            SMUDGE_CONFIG.expandMultiplier -
            initialRadius
          ) * eased;
      } else {
        radius =
          initialRadius *
          SMUDGE_CONFIG.expandMultiplier;
      }

      // ----------------------------------------------
      // DISSOLVE
      // Equivalent to GSAP power3.in
      // ----------------------------------------------

      if (elapsed >= dissolveStart) {
        const dissolveProgress = Math.min(
          (elapsed - dissolveStart) /
            dissolveDuration,
          1
        );

        const eased =
          Math.pow(dissolveProgress, 3);

        const expandedRadius =
          initialRadius *
          SMUDGE_CONFIG.expandMultiplier;

        radius = expandedRadius * (1 - eased);
      }

      stamp.element.setAttribute(
        "r",
        Math.max(0, radius)
      );
    }
  }

  // --------------------------------------------------
  // SINGLE ANIMATION LOOP
  // --------------------------------------------------

  function requestSmudgeUpdate() {
    if (isDestroyed || isLoopRunning) return;

    isLoopRunning = true;

    rafId = requestAnimationFrame(update);
  }

  function update(now) {
    if (isDestroyed) return;

    let pointerIsMoving = false;

    if (hasStarted) {
      smoothPointer.x +=
        (pointer.x - smoothPointer.x) *
        SMUDGE_CONFIG.smoothing;

      smoothPointer.y +=
        (pointer.y - smoothPointer.y) *
        SMUDGE_CONFIG.smoothing;

      const speed = Math.hypot(
        pointer.x - smoothPointer.x,
        pointer.y - smoothPointer.y
      );

      if (
        speed > SMUDGE_CONFIG.movementThreshold
      ) {
        stampSmudgeAt(
          smoothPointer.x,
          smoothPointer.y,
          speed * SMUDGE_CONFIG.sizeFromSpeed
        );
      }

      pointerIsMoving = speed >= 0.005;
    }

    // Animate all existing stamps using the same RAF.
    updateActiveStamps(now);

    // Continue while the pointer is settling OR while
    // stamps are still expanding/dissolving.
    if (
      pointerIsMoving ||
      activeStamps.length > 0
    ) {
      rafId = requestAnimationFrame(update);
    } else {
      isLoopRunning = false;
      rafId = null;
    }
  }

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  return () => {
    isDestroyed = true;

    heroSection.removeEventListener(
      "pointermove",
      onPointerMove
    );

    resizeObserver.disconnect();

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    isLoopRunning = false;

    // Remove all stamps and release their references.
    for (const stamp of activeStamps) {
      stamp.element.remove();
    }

    activeStamps.length = 0;

    // Also clear anything left in the SVG group.
    smudgeContainer.replaceChildren();
  };
}, []);

  return (
    <main ref={driverRef} className="relative min-h-screen w-full overflow-x-hidden bg-white text-black selection:bg-black selection:text-white lg:h-screen lg:w-screen lg:overflow-x-hidden lg:overflow-y-auto">
      {/* ================= FIXED NAVBAR: ONLY HOME IN TOP LEFT ================= */}
      <nav className="fixed top-4 sm:top-5 left-4 sm:left-12 z-[1000] select-none">
        <Link
          href="/"
          data-transition-label="HOME"
          className="hidden lg:inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-neutral-700 border-y border-black p-2  uppercase cursor-pointer"
        >
          {/* <span className="text-black text-lg">&#91; </span> */}
          <span className="hover:opacity-60 transition-opacity">←</span>
          <KineticText className="hover:opacity-60 transition-opacity" text="HOME" />
          {/* <span className="text-black text-lg"> &#93;</span> */}
        </Link>
      </nav>

      {/* Floating Bottom Navigation Pill on Mobile */}
      <MobileBottomNav theme="light" active="about" />

      {/* ================= CONTINUOUS SCROLL CONTAINER: VERTICAL ON MOBILE, HORIZONTAL ON LG ================= */}
      <div
        ref={containerRef}
        className="relative w-full flex flex-col lg:sticky lg:top-0 lg:h-screen lg:w-max lg:min-w-full lg:overflow-visible lg:flex-row select-none no-scrollbar will-change-transform"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ----------------- SECTION 1: HERO (01) ----------------- */}
        <section className="relative min-h-screen min-h-[100dvh] w-full lg:h-screen lg:w-screen shrink-0 flex flex-col justify-between p-5 sm:p-10 lg:p-8 bg-white">
          {/* Top Info Bar */}
          <div className="w-full flex items-center justify-end z-20">
            <div className="flex items-center gap-3 sm:gap-8">
              <span
                className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-neutral-800 uppercase cursor-default"
              >
                A LITTLE RUN THROUGH MY MIND
              </span>
              <div className="bg-black text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-sm text-[11px] sm:text-xs font-medium tracking-wider tabular-nums min-w-[62px] min-h-[22px] flex items-center justify-center text-center">
                <LocalTime />
              </div>
            </div>
          </div>

          {/* Left Indicator */}
          <div className="hidden lg:block absolute left-10 lg:left-12 top-[42%] text-[11px] font-semibold tracking-[0.2em] text-neutral-600">
            JUST SCROLL 
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
              <span 
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase cursor-pointer hover:text-black transition-colors">
                Keep going
              </span>
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

            <div className="flex w-30"></div>
            <div className="absolute right-[15%] sm:right-[11%] w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-black " />
          </div>
        </section>

        <section
          ref={bookSectionRef}
          className="relative h-[45vh] sm:h-[55vh] lg:h-screen w-full lg:w-screen shrink-0 flex items-center justify-center overflow-hidden"
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0">
              <Image
                src="/intro-book-tilted.webp"
                alt="Book"
                width={1920}
                height={1080}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ----------------- SECTION 2: THINGS THAT DON'T MAKE SENSE ----------------- */}
        <section
          ref={section2Ref}
          className="relative min-h-screen w-full lg:h-screen lg:w-screen shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-200 bg-white text-black p-5 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden"
        >
          {/* Top Bar: Name + Stacked Index/Approach */}
          <div className="pt-10 sm:pt-16 lg:pt-40 flex-1 min-h-0 flex flex-col">
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
            <div className="relative w-full flex-1 min-h-0 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12 overflow-visible lg:overflow-hidden">
              {/* Left Part: Scrollable Steps (01, 02, 03 - opinions and personal observations) */}
              <div
                ref={leftScrollRef}
                className="w-full lg:w-[56%] h-auto lg:h-full overflow-visible lg:overflow-y-auto no-scrollbar pr-0 lg:pr-12"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* Mobile title */}
                <div className="lg:hidden shrink-0 text-left select-none pb-8">
                  <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-black leading-[0.95]">
                    Things that don&apos;t make sense
                  </h2>
                </div>

                <div className="flex flex-col gap-10 sm:gap-16 lg:gap-28 pt-4 pb-32 sm:pb-24 lg:pb-48">
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
          <div className="w-full h-20 lg:h-4 shrink-0" />
        </section>

        {/* ----------------- SECTION 3: Smudge Revealer ----------------- */}
        <section
          ref={heroRef}
          className="hero relative min-h-screen min-h-[100dvh] w-full lg:h-screen lg:w-screen shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-200 overflow-hidden"
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
        <section className="relative min-h-screen min-h-[100dvh] w-full lg:h-screen lg:w-screen shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-200 bg-white text-black flex items-center justify-center p-6 sm:p-12 overflow-hidden select-none">
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight [word-spacing:0.5rem] sm:[word-spacing:1rem] uppercase text-black text-center">
            <span className="block overflow-hidden">
              <span className="inline-block animate-mask-slide-up [animation-delay:150ms]">
                its done bro
              </span>
            </span>
          </h2>
        </section>

      </div>
      <div ref={spacerRef} aria-hidden="true" className="hidden lg:block w-px pointer-events-none" />
    </main>
  );
}
