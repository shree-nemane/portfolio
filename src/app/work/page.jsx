import React from "react";
import Navbar from "../../components/Navbar";
import { TransitionLink } from "../../components/PageTransition";
import { projects } from "../../data/projects";
import ScrambleText from "../../components/ScrambleText";
import ParallaxCard from "../../components/ParallaxCard";

/**
 * WorkPage (React Server Component)
 * Curated archive of production digital products, experiments, and technical skills.
 * Leverages client components (<ParallaxCard />, <ScrambleText />, <TransitionLink />)
 * for micro-interactions while retaining server-rendered speed and SEO efficiency.
 */
export default function WorkPage() {
  const primaryProjects = projects.filter((p) => p.type !== "experiment");
  const experimentProjects = projects.filter((p) => p.type === "experiment");

  const currentProducts = primaryProjects.map((p) => ({
    title: p.title,
    slug: p.slug,
    type: p.category,
  }));

  const resolveAsset = (src) => {
    if (!src) return "";
    if (src.startsWith("/") || src.startsWith("http")) return src;
    return `/${src}`;
  };

  const skills = [
    { skill: "Frontend Development", tech: "React, Next.js, Tailwind CSS" },
    { skill: "Android Development", tech: "React Native" },
    { skill: "Interactive Motion", tech: "GSAP, Canvas" },
    { skill: "Full-Stack Web", tech: "Node.js, Python" },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-[#0e0e10] text-[#f2f2f2] selection:bg-white selection:text-black">
      {/* Top Header Navigation */}
      <Navbar theme="dark" active="work" />

      {/* Main Editorial Content Container */}
      <div className="w-full mx-auto px-5 sm:px-12 lg:px-16 py-8 sm:py-16 mt-16 sm:mt-24 md:mt-36 flex flex-col gap-10 sm:gap-20">
        {/* Intro / Header identity */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-1">
            <p className="text-xl sm:text-3xl md:text-4xl text-white font-semibold ">
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:80ms]">
                  Always find something to confuse me ^_^
                </span>
              </span>
            </p>
          </div>

          {/* About narrative */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              <span className="text-white text-lg">&#91; </span>
              <ScrambleText text="Work" />
              <span className="text-white text-lg"> &#93;</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-normal max-w-xl">
              I specialize in component-driven user interfaces, brand design systems, and tactile web experiences. Combining minimalist ergonomics with computational design, I create thoughtful digital flagship platforms and design tools for forward-thinking products and ateliers.
            </p>
          </div>

          {/* Social / Direct Channels */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-neutral-400 pt-1">
            {/* <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              Twitter / X
            </a> */}
            <a
              href="https://github.com/shree-nemane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              GitHub
            </a>
            {/* <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              Dribbble
            </a> */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              LinkedIn
            </a>
            <a
              href="mailto:contact@shreenemane06@gmail.com"
              className="hover:text-white transition-colors duration-150"
            >
              Email
            </a>
          </div>
        </section>

        {/* Two-Column Editorial Section (Products & Skills) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 pt-2 w-full">
          {/* Left Column: Products */}
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-white">
                Products
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-white/5">
              {currentProducts.map((item, idx) => (
                <TransitionLink
                  key={idx}
                  href={`/work/${item.slug}`}
                  label={item.title.toUpperCase()}
                  className="py-2.5 flex items-center justify-between text-xs sm:text-[13px] group hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-neutral-300 group-hover:text-white font-normal transition-colors">
                    {item.title}
                  </span>
                  <span className="text-neutral-500 group-hover:text-neutral-400 text-[11px] transition-colors">
                    {item.type} ↗
                  </span>
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Right Column: Skills */}
          <div className="flex w-full flex-col justify-start gap-4 max-w-xl justify-self-end">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <h3 className="text-sm sm:text-base font-semibold tracking-tight text-white">
                Skills
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-white/5">
              {skills.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-[13px]">
                  <span className="text-neutral-300 font-normal">{item.skill}</span>
                  <span className="text-neutral-500 text-[11px]">{item.tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Projects Grid */}
        <section className="flex flex-col gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              {/* <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                01. CURATED CLIENT WORK
              </span> */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Production Products &amp; Platforms
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              ({String(primaryProjects.length).padStart(2, "0")} Selected Cases)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {primaryProjects.map((project) => (
              <TransitionLink
                key={project.id}
                href={`/work/${project.slug}`}
                label={project.title.toUpperCase()}
                className="block shadow-sm"
              >
                <ParallaxCard
                  imageSrc={resolveAsset(project.logo || project.image)}
                  imageAlt={project.alt || project.shortTitle || project.title}
                  className={`aspect-3/2 w-full border border-white/10 ${project.cardBg || "bg-white"}`}
                  imgClassName="object-contain p-4 sm:p-6"
                >
                  {/* Bottom Box Overlay - visible only on hover */}
                  <div className="absolute bottom-0 w-full p-2 sm:p-2.5 bg-black/85 backdrop-blur-md border border-white/15 flex flex-col gap-0.5 shadow-lg opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-400 pointer-events-none">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[12px] sm:text-[13px] font-medium text-white truncate leading-tight">
                        {project.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 shrink-0">
                        ↗
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 truncate leading-tight">
                      {project.category}
                    </span>
                  </div>
                </ParallaxCard>
              </TransitionLink>
            ))}
          </div>
        </section>

        {/* Experiments Grid */}
        <section className="flex flex-col gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              {/* <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                02. CREATIVE CODE &amp; PROTOTYPES
              </span> */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Explorations
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              ({String(experimentProjects.length).padStart(2, "0")} Explorations)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {experimentProjects.map((project) => (
              <TransitionLink
                key={project.id}
                href={`/work/${project.slug}`}
                label={project.title.toUpperCase()}
                className="block shadow-sm"
              >
                <ParallaxCard
                  imageSrc={resolveAsset(project.logo || project.image)}
                  imageAlt={project.alt || project.shortTitle || project.title}
                  className={`aspect-3/2 w-full  border border-white/10 ${project.cardBg || "bg-neutral-900"}`}
                  imgClassName="object-cover"
                >
                  {/* Bottom Box Overlay - visible only on hover */}
                  <div className="absolute bottom-0 w-full p-2 sm:p-2.5 bg-black/85 backdrop-blur-md border border-white/15 flex flex-col gap-0.5 shadow-lg opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-400 pointer-events-none">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[12px] sm:text-[13px] font-medium text-white truncate leading-tight">
                        {project.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 shrink-0">
                        ↗
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 truncate leading-tight">
                      {project.category}
                    </span>
                  </div>
                </ParallaxCard>
              </TransitionLink>
            ))}
          </div>
        </section>
      </div>

      {/* Editorial Quote */}
      <footer className="w-full pt-12 pb-24 sm:py-16 px-5 sm:px-12 lg:px-16 flex flex-col items-start justify-center text-left select-none">
        <blockquote className="max-w-2xl text-base sm:text-lg font-light text-neutral-300 tracking-tight leading-relaxed">
          &ldquo;Simplicity is about subtracting the obvious and adding the meaningful.&rdquo;
        </blockquote>
        <span className="mt-3 text-xs text-neutral-500 tracking-widest uppercase font-medium">
          — John Maeda
        </span>
      </footer>
    </main>
  );
}
