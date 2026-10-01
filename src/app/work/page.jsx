import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { projects } from "../../data/projects";
import KineticText from "../../components/KineticText";
import ParallaxCard from "../../components/ParallaxCard";

export const metadata = {
  title: "Work & Production Cases",
  description:
    "Curated archive of production digital products, mobile applications, desktop systems, and software engineering experiments by Shree Nemane.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Work & Production Cases | Shree Nemane",
    description:
      "Curated archive of production digital products, mobile applications, desktop systems, and software engineering experiments by Shree Nemane.",
    url: "/work",
  },
};

/**
 * WorkPage (React Server Component)
 * Curated archive of production digital products, experiments, and technical skills.
 * Leverages client components (<ParallaxCard />, <KineticText />)
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
    { skill: "Web Development", tech: "React, Next.js, Tailwind CSS" },
    { skill: "Mobile Development", tech: "React Native for Android and iOS" },
    { skill: "Backend & Automation", tech: "Node.js, Python" },
    { skill: "Interactive Motion", tech: "GSAP, Canvas" },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-[#0e0e10] text-[#f2f2f2] selection:bg-white selection:text-black">
      {/* Top Header Navigation */}
      <Navbar theme="dark" active="work" />

      {/* Main Editorial Content Container */}
      <div className="w-full mx-auto px-5 sm:px-12 lg:px-16 py-8 sm:py-16 mt-16 sm:mt-24 md:mt-36 flex flex-col gap-10 sm:gap-20">
        {/* Intro / Header identity */}
        <section className="flex flex-col gap-10 items-end">
          <div className="flex flex-col gap-1">
            <p className="text-xl sm:text-3xl md:text-4xl text-white font-semibold ">
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:80ms]">
                  ^_^ Always find something to confuse me 
                </span>
              </span>
            </p>
          </div>

          {/* About narrative */}
          <div className="flex flex-col gap-3 items-end">
            <h2 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              <span className="text-white text-lg">&#91; </span>
              <KineticText text="Work" />
              <span className="text-white text-lg"> &#93;</span>
            </h2>
            <p className="text-sm sm:text-base text-end leading-relaxed text-neutral-300 font-normal max-w-xl">
              Every project here is something I designed, built, and shipped, from business websites and a mobile app to a desktop tool and a machine learning system. Some earn money for their owners, others are experiments I couldn't stop thinking about. Open any card to see the problem, what I built, and how it turned out.
              </p>
          </div>

          {/* Social / Direct Channels */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-neutral-400 pt-1">
            <a
              href="https://github.com/shree-nemane"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shreedarshan-nemane-455417329"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-150"
            >
              LinkedIn
            </a>
            <a
              href="mailto:shreenemane06@gmail.com"
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
                <Link
                  key={idx}
                  href={`/work/${item.slug}`}
                  data-transition-label={item.title.toUpperCase()}
                  className="py-2.5 flex items-center justify-between text-xs sm:text-[13px] group hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-neutral-300 group-hover:text-white font-normal transition-colors">
                    {item.title}
                  </span>
                  <span className="text-neutral-500 group-hover:text-neutral-400 text-[11px] transition-colors">
                    {item.type} ↗
                  </span>
                </Link>
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
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
               Products &amp; Platforms
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              ({String(primaryProjects.length).padStart(2, "0")} Selected Cases)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {primaryProjects.map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                data-transition-label={project.title.toUpperCase()}
                className="block shadow-sm"
              >
                <div className="flex p-2 border border-white/20">
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
                </div>
                
              </Link>
            ))}
          </div>
        </section>

        {/* Experiments Grid */}
        <section className="flex flex-col gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
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
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                data-transition-label={project.title.toUpperCase()}
                className="block shadow-sm"
              >
                <div className="flex p-2 border border-white/20">
                <ParallaxCard
                  imageSrc={resolveAsset(project.logo || project.image)}
                  imageAlt={project.alt || project.shortTitle || project.title}
                  className={`aspect-3/2 w-full border border-white/10 ${project.cardBg || "bg-neutral-900"}`}
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Editorial Quote */}
      <footer className="w-full pt-12 pb-32 sm:py-16 px-5 sm:px-12 lg:px-16 flex flex-col items-start justify-center text-left select-none">
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
