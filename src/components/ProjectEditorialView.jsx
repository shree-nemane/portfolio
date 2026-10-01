import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAdjacentProjects } from "../data/projects";

/**
 * ProjectEditorialView (The Modular Editorial Storytelling Canvas)
 * Minimalist, quiet, prestigious Swiss editorial aesthetic.
 *
 * Theme Architecture:
 *  - Production Projects: Soft warm stone paper (#F4F4F2) + deep obsidian text (#171717)
 *  - Lab Experiments: Dark obsidian canvas (#0e0e10) + crisp silver/white text (#f2f2f2)
 *
 * Fully modular & conditional:
 *  - Zero card clutter or generic drop-shadow boxes
 *  - Disciplined 1px Swiss border dividers
 *  - Android apps rendered in native portrait frames (no fake desktop containers)
 *  - All visual blocks (moodboards, palettes, typography, quotes) collapse cleanly when omitted
 */
export default function ProjectEditorialView({ project }) {
  if (!project) return null;

  const { next } = getAdjacentProjects(project.slug);
  const isExperiment = project.type === "experiment";
  const validMobileScreens = project.mobileScreens?.filter((s) => s && s.image && s.image.trim() !== "");
  const validGallery = project.gallery?.filter((g) => g && g.image && g.image.trim() !== "");

  const isApp =
    project.type === "mobile" ||
    project.type === "app" ||
    project.type === "desktop" ||
    Boolean(project.mobileScreens && project.mobileScreens.length > 0) ||
    (typeof project.category === "string" && /app|mobile|android|ios|desktop/i.test(project.category));
  const isMobileApp = project.type === "mobile" || Boolean(validMobileScreens && validMobileScreens.length > 0);

  const resolveAsset = (src) => {
    if (!src) return "";
    if (src.startsWith("/") || src.startsWith("http")) return src;
    return `/${src}`;
  };

  // Palette & Theme tokens based on archetype
  const bgClass = isExperiment ? "bg-[#0e0e10] text-[#f2f2f2]" : "bg-[#F4F4F2] text-[#171717]";
  const selectionClass = isExperiment ? "selection:bg-white selection:text-black" : "selection:bg-black selection:text-white";
  const mutedTextClass = isExperiment ? "text-neutral-400" : "text-neutral-500";
  const bodyTextClass = isExperiment ? "text-neutral-300" : "text-neutral-600";
  const borderRuleClass = isExperiment ? "border-white/10" : "border-neutral-200";
  const backbuttonborder = isExperiment ? "border-white" : "border-black/20";
  const buttonClasses = isExperiment
    ? "bg-white text-neutral-900 hover:bg-neutral-200 active:scale-95 transition-all duration-200 rounded-full px-5 py-2 text-xs font-medium tracking-wide inline-flex items-center gap-1.5 shadow-2xs"
    : "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all duration-200 rounded-full px-5 py-2 text-xs font-medium tracking-wide inline-flex items-center gap-1.5 shadow-2xs";

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${bgClass} ${selectionClass}`}>
      {/* ========================================================================= */}
      {/* TOP HEADER NAVIGATION                                                     */}
      {/* ========================================================================= */}
      <nav className="w-full max-w-6xl mx-auto pt-8 sm:pt-12 px-6 sm:px-10 flex items-center justify-between select-none">
        <Link
          href={`/work?project=${project.slug}`}
          data-transition-label="WORK GALLERY"
          className={`inline-flex items-center gap-2 text-xs font-mono uppercase border-y ${backbuttonborder} p-2 tracking-widest ${mutedTextClass} hover:opacity-100 transition-opacity cursor-pointer`}
        >
          {/* <span className="font-sans text-base">&#91;</span> */}
          <span>← Back to gallery</span>
          {/* <span className="font-sans text-base">&#93;</span> */}
        </Link>

        <div className="flex items-center gap-4">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs tracking-wider ${buttonClasses} hover:opacity-100 transition-opacity`}
            >
              GitHub ↗
            </a>
          )}
          {project.liveUrl && project.liveUrl !== "-" && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              <span>{isMobileApp ? "Get App" : isExperiment ? "Live Demo" : "Visit Live"}</span>
              <span className="text-xs">↗</span>
            </a>
          )}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MAIN STORYTELLING CONTAINER                                              */}
      {/* ========================================================================= */}
      <main className="w-full max-w-6xl mx-auto px-6 sm:px-10 pt-12 sm:pt-16 pb-28 flex flex-col gap-16 sm:gap-24">
        {/* IDENTITY & CONTEXT HEADER */}
        <header className="flex flex-col gap-5 max-w-4xl">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span>
              {project.badge
                ? `[ ${project.badge} ]`
                : `[ ${project.category || (isExperiment ? "RESEARCH & EXPLORATION" : "CURATED PROJECT")} ]`}
            </span>
            {project.experimentNumber && project.experimentNumber !== "-" && (
              <>
                <span className="opacity-40">/</span>
                <span>EXP_{project.experimentNumber}</span>
              </>
            )}
            {project.year && (
              <>
                <span className="opacity-40">/</span>
                <span>{project.year}</span>
              </>
            )}
            {project.discipline && (
              <>
                <span className="opacity-40">/</span>
                <span className="hidden sm:inline">{project.discipline}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mt-1">
            {project.title}
          </h1>

          {project.tagline && (
            <p className={`text-lg sm:text-2xl font-light tracking-tight mt-2 max-w-3xl leading-snug ${isExperiment ? "text-neutral-300" : "text-neutral-700"}`}>
              {project.tagline}
            </p>
          )}

          {project.description && (
            <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-2xl pt-1 ${bodyTextClass}`}>
              {project.description}
            </p>
          )}
        </header>

        {/* METADATA STRIP (Pure Swiss 1px lines, no box cards) */}
        {project.metrics && project.metrics.length > 0 && (
          <div className={`w-full border-t ${borderRuleClass} pt-6 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-6`}>
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {metric.label}
                </span>
                <span className="text-sm sm:text-base font-medium">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULAR EDITORIAL STORYTELLING CANVAS                                     */}
        {/* Adapts seamlessly for apps, websites, tech experiments, and research.    */}
        {/* All topics of presentation and section titles are data-driven.           */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-16 sm:gap-24">
          {/* OPTIONAL: Moodboard / Research Reference */}
          {project.moodboardImage && project.moodboardImage.trim() !== "" && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest">
                <span>{project.moodboardTitle || "[ VISUAL MOODBOARD & RESEARCH ]"}</span>
                <span>Aesthetic Concept</span>
              </div>
              <div className={`w-full rounded-xl sm:rounded-2xl overflow-hidden border shadow-sm ${isExperiment ? "border-white/10 bg-black" : "border-neutral-200/90 bg-white"}`}>
                <Image
                  src={resolveAsset(project.moodboardImage)}
                  alt="Project moodboard inspiration"
                  width={1400}
                  height={900}
                  className="w-full h-auto object-cover block"
                />
              </div>
            </section>
          )}

          {/* MEDIUM SHOWCASE: MOBILE APPS (ANDROID / IOS) — WORKS FOR EXPERIMENTS & PRODUCTION */}
          {validMobileScreens && validMobileScreens.length > 0 ? (
            <section className="flex flex-col gap-6">
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.mobileTitle || "[ INTERFACE ARCHITECTURE · ANDROID OS ]"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto w-full">
                {validMobileScreens.map((screen, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    {/* Physical phone bezel representation (clean minimal glass border) */}
                    <div className={`relative w-full aspect-[9/18.5] rounded-[2.2rem] sm:rounded-[2.6rem] overflow-hidden border-[3px] shadow-xl p-2 ${isExperiment ? "border-neutral-700 bg-black" : "border-neutral-800/15 bg-white"}`}>
                      <Image
                        data-hero-image={idx === 0 ? "true" : undefined}
                        src={resolveAsset(screen.image)}
                        alt={screen.title || project.title}
                        width={600}
                        height={1233}
                        priority={idx === 0}
                        className="w-full h-full object-cover rounded-[1.8rem] sm:rounded-[2.2rem] block"
                      />
                    </div>
                    {((screen.title && screen.title !== "-") || (screen.caption && screen.caption !== "-")) && (
                      <div className="flex flex-col px-2">
                        {screen.title && screen.title !== "-" && (
                          <h3 className={`text-sm font-semibold tracking-tight ${isExperiment ? "text-white" : "text-neutral-900"}`}>
                            {screen.title}
                          </h3>
                        )}
                        {screen.caption && screen.caption !== "-" && (
                          <p className={`text-xs leading-relaxed mt-0.5 ${mutedTextClass}`}>
                            {screen.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : project.image && project.image.trim() !== "" ? (
            /* MEDIUM SHOWCASE: WEB PLATFORMS, DESKTOP APPS, OR VISUAL ARTIFACTS */
            <section className="flex flex-col gap-8">
              {project.phoneFrame ? (
                /* Single mobile app preview with phone bezel if explicitly configured */
                <div className="max-w-md mx-auto w-full flex flex-col gap-3">
                  <div className={`relative w-full aspect-[9/18.5] rounded-[2.2rem] sm:rounded-[2.6rem] overflow-hidden border-[3px] shadow-xl p-2 ${isExperiment ? "border-neutral-700 bg-black" : "border-neutral-800/15 bg-white"}`}>
                    <Image
                      data-hero-image="true"
                      src={resolveAsset(project.image)}
                      alt={project.alt ?? project.title}
                      width={600}
                      height={1233}
                      priority
                      className="w-full h-full object-cover rounded-[1.8rem] sm:rounded-[2.2rem] block"
                    />
                  </div>
                </div>
              ) : (
                /* Full visual showcase viewport (3D Mockups, Web, Desktop, & Mobile Platforms) */
                <div className="flex flex-col gap-3">
                  <div className={`w-full rounded-xl sm:rounded-2xl overflow-hidden border shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${isExperiment ? "border-white/10 bg-black" : "border-neutral-200/90 bg-white"}`}>
                    <Image
                      data-hero-image="true"
                      src={resolveAsset(project.image)}
                      alt={project.alt ?? project.title}
                      width={1600}
                      height={1200}
                      priority
                      className="w-full h-auto block"
                    />
                  </div>
                  {project.primaryCaption && (
                    <span className="text-xs text-neutral-400 font-mono tracking-wide px-1">
                      {project.primaryCaption}
                    </span>
                  )}
                </div>
              )}

              {/* Secondary Interface Viewport (Optional) */}
              {project.secondaryImage && project.secondaryImage.trim() !== "" && (
                <div className="flex flex-col gap-3">
                  <div className={`w-full rounded-xl sm:rounded-2xl overflow-hidden border shadow-sm ${isExperiment ? "border-white/10 bg-black" : "border-neutral-200/90 bg-white"}`}>
                    <Image
                      src={resolveAsset(project.secondaryImage)}
                      alt="Interface detail preview"
                      width={1600}
                      height={1000}
                      className="w-full h-auto max-h-[580px] object-cover block"
                    />
                  </div>
                  {project.secondaryCaption && (
                    <span className="text-xs text-neutral-400 font-mono tracking-wide px-1">
                      {project.secondaryCaption}
                    </span>
                  )}
                </div>
              )}
            </section>
          ) : null}

          {/* TOPIC / PREMISE / INQUIRY / HYPOTHESIS (Data-Driven Title) */}
          {(project.hypothesis || project.inquiry || project.premise) && (
            <section className={`border-t ${borderRuleClass} pt-8 flex flex-col gap-3`}>
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.hypothesisTitle || project.inquiryTitle || (isApp ? "[ CONCEPT & OBJECTIVE ]" : isExperiment ? "[ RESEARCH INQUIRY & HYPOTHESIS ]" : "[ THE PREMISE ]")}
              </span>
              <p className={`text-lg sm:text-2xl font-normal leading-relaxed max-w-3xl ${isExperiment ? "text-white" : "text-neutral-900"}`}>
                &ldquo;{project.hypothesis || project.inquiry || project.premise}&rdquo;
              </p>
            </section>
          )}

          {/* TOPIC / PIPELINE / MECHANICS / CAPABILITIES (Data-Driven Title) */}
          {project.mechanics && project.mechanics.length > 0 && (
            <section className={`border-t ${borderRuleClass} pt-8 flex flex-col gap-4`}>
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.mechanicsTitle || (isApp ? "[ CORE CAPABILITIES & STACK ]" : isExperiment ? "[ PIPELINE & SYSTEM MECHANICS ]" : "[ ARCHITECTURAL MECHANICS ]")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl">
                {project.mechanics.map((mech, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 text-xs sm:text-sm font-mono ${isExperiment ? "text-neutral-300" : "text-neutral-700"}`}
                  >
                    <span className="text-neutral-500 select-none">&gt;</span>
                    <span className="leading-relaxed">{mech}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TOPIC / CHALLENGE VS. SOLUTION (Data-Driven Titles) */}
          {(project.challenge || project.solution) && (
            <section className={`border-t ${borderRuleClass} pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16`}>
              {project.challenge && (
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                    {project.challengeTitle || "01 / THE CHALLENGE"}
                  </span>
                  <p className={`text-sm sm:text-base leading-relaxed font-normal ${isExperiment ? "text-neutral-300" : "text-neutral-700"}`}>
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                    {project.solutionTitle || "02 / THE ARCHITECTURE & SOLUTION"}
                  </span>
                  <p className={`text-sm sm:text-base leading-relaxed font-normal ${isExperiment ? "text-neutral-300" : "text-neutral-700"}`}>
                    {project.solution}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* CUSTOM PRESENTATION TOPICS / SECTIONS (Dynamic Data Array) */}
          {project.sections && Array.isArray(project.sections) && project.sections.map((section, sIdx) => (
            <section key={sIdx} className={`border-t ${borderRuleClass} pt-8 sm:pt-10 flex flex-col gap-4`}>
              {section.title && (
                <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                  [ {section.title} ]
                </span>
              )}
              {section.content && (
                <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-3xl ${bodyTextClass}`}>
                  {section.content}
                </p>
              )}
              {section.code && (
                <div className={`w-full overflow-x-auto p-4 rounded-lg font-mono text-xs sm:text-sm leading-relaxed border ${isExperiment ? "bg-black/60 border-white/10 text-neutral-300" : "bg-neutral-100 border-neutral-200 text-neutral-800"}`}>
                  <pre className="font-mono whitespace-pre">{section.code}</pre>
                </div>
              )}
              {section.table && Array.isArray(section.table) && (
                <div className={`w-full overflow-x-auto border rounded-lg ${isExperiment ? "border-white/10" : "border-neutral-200"}`}>
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
                    {section.tableHeaders && (
                      <thead>
                        <tr className={`border-b ${isExperiment ? "border-white/10 bg-white/5 text-neutral-300" : "border-neutral-200 bg-neutral-100 text-neutral-700"}`}>
                          {section.tableHeaders.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 font-semibold tracking-wider uppercase text-[11px]">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {section.table.map((row, rIdx) => (
                        <tr key={rIdx} className={`border-b last:border-b-0 ${isExperiment ? "border-white/5 text-neutral-300 hover:bg-white/[0.02]" : "border-neutral-200/60 text-neutral-700 hover:bg-neutral-50"}`}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 align-top leading-relaxed">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.items && Array.isArray(section.items) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl">
                  {section.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className={`flex items-start gap-3 text-xs sm:text-sm font-mono ${isExperiment ? "text-neutral-300" : "text-neutral-700"}`}
                    >
                      <span className="text-neutral-500 select-none">&gt;</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* TOPIC / COLOR PALETTE SWATCHES (Optional) */}
          {project.palette && project.palette.length > 0 && (
            <section className={`border-t ${borderRuleClass} pt-10 flex flex-col gap-5`}>
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.paletteTitle || "[ COLOR IDENTITY & TOKENS ]"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {project.palette.map((color, idx) => (
                  <div key={idx} className="flex flex-col gap-2.5">
                    <div
                      className={`w-full h-16 sm:h-20 rounded-lg border shadow-2xs ${isExperiment ? "border-white/10" : "border-black/5"}`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold truncate ${isExperiment ? "text-white" : "text-neutral-900"}`}>
                        {color.name}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {color.hex}
                      </span>
                      <span className={`text-[11px] font-normal ${mutedTextClass}`}>
                        {color.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TOPIC / TYPOGRAPHY SYSTEM (Optional) */}
          {project.typography && (
            <section className={`border-t ${borderRuleClass} pt-10 flex flex-col gap-5`}>
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.typographyTitle || "[ TYPOGRAPHIC SYSTEM ]"}
              </span>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                  <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${isExperiment ? "text-white" : "text-neutral-900"}`}>
                    {project.typography.display}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    / Headings
                  </span>
                  <span className="hidden sm:inline text-neutral-400">·</span>
                  <span className={`text-base sm:text-lg font-medium ${isExperiment ? "text-neutral-200" : "text-neutral-700"}`}>
                    {project.typography.body}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    / Interface Body
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-mono tracking-widest text-neutral-400 uppercase select-none">
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
                </p>

                {project.typography.sample && (
                  <blockquote className={`text-base sm:text-xl font-normal italic border-l-2 pl-4 py-0.5 mt-2 ${isExperiment ? "text-neutral-300 border-white/60" : "text-neutral-700 border-neutral-900"}`}>
                    &ldquo;{project.typography.sample}&rdquo;
                  </blockquote>
                )}
              </div>
            </section>
          )}

          {/* TOPIC / FINDINGS / VERDICT / TAKEAWAY (Data-Driven Title) */}
          {(project.takeaway || project.findings || project.outcome) && (
            <section className={`border-t ${borderRuleClass} pt-8 flex flex-col gap-3`}>
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.takeawayTitle || project.findingsTitle || (isApp ? "[ RESULTS & IMPACT ]" : isExperiment ? "[ FINDINGS & VERDICT ]" : "[ KEY TAKEAWAYS & OUTCOMES ]")}
              </span>
              <p className={`text-sm sm:text-base font-normal leading-relaxed max-w-3xl ${isExperiment ? "text-neutral-300" : "text-neutral-700"}`}>
                {project.takeaway || project.findings || project.outcome}
              </p>
            </section>
          )}

          {/* OPTIONAL: Editorial Pull Quote */}
          {project.quote && project.quote !== "-" && (
            <section className="my-4 max-w-3xl mx-auto text-center px-4">
              <blockquote className={`text-xl sm:text-3xl font-light leading-relaxed tracking-tight ${isExperiment ? "text-neutral-200" : "text-neutral-800"}`}>
                &ldquo;{project.quote}&rdquo;
              </blockquote>
              {project.client && project.client !== "-" && (
                <span className="block text-xs font-mono text-neutral-400 mt-4 uppercase tracking-widest">
                  — {project.client}
                </span>
              )}
            </section>
          )}

          {/* OPTIONAL: Additional Gallery Viewports */}
          {validGallery && validGallery.length > 0 && !isMobileApp && (
            <section className={`border-t ${borderRuleClass} pt-10 flex flex-col gap-8`}>
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                {project.galleryTitle || "[ ADDITIONAL INTERFACE VIEWPORTS ]"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {validGallery.map((item, idx) => (
                  <article key={idx} className="flex flex-col gap-3">
                    <div className={`w-full rounded-xl overflow-hidden border shadow-2xs ${isExperiment ? "border-white/10 bg-black" : "border-neutral-200/90 bg-white"}`}>
                      <Image
                        src={resolveAsset(item.image)}
                        alt={item.title || `Gallery screenshot ${idx + 1}`}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover block"
                      />
                    </div>
                    {((item.title && item.title !== "-") || (item.caption && item.caption !== "-")) && (
                      <div className="flex flex-col px-1">
                        {item.title && item.title !== "-" && (
                          <h3 className={`text-sm font-semibold tracking-tight ${isExperiment ? "text-white" : "text-neutral-900"}`}>
                            {item.title}
                          </h3>
                        )}
                        {item.caption && item.caption !== "-" && (
                          <p className={`text-xs font-normal leading-relaxed mt-0.5 ${mutedTextClass}`}>
                            {item.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FOOTER: NEXT PROJECT BRIDGE                                              */}
        {/* ========================================================================= */}
        {next && (
          <footer className={`w-full border-t ${borderRuleClass} mt-12 pt-8 flex items-center justify-between select-none`}>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                Next {next.type === "experiment" ? "Experiment" : "Project"}
              </span>
              <span className="text-xl sm:text-2xl font-semibold tracking-tight mt-0.5">
                {next.title}
              </span>
            </div>

            <Link
              href={`/work/${next.slug}`}
              data-transition-label={next.title.toUpperCase()}
              className={buttonClasses}
            >
              <span>View Next</span>
              <span className="text-xs">→</span>
            </Link>
          </footer>
        )}
      </main>
    </div>
  );
}
