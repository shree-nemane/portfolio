import React from "react";
import Navbar from "../../components/Navbar";
import { services } from "../../data/services";

export const metadata = {
  title: "Services & Capabilities",
  description:
    "Design and full-stack web engineering services by Shree Nemane. Building fast, responsive websites, mobile applications, and custom systems automation tools.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services & Capabilities | Shree Nemane",
    description:
      "Design and full-stack web engineering services by Shree Nemane. Building fast, responsive websites, mobile applications, and custom systems automation tools.",
    url: "/services",
  },
};

/**
 * ServicesPage (React Server Component)
 * Clean editorial overview of design and development service offerings.
 * Renders capabilities in a responsive 12-column grid layout with zero client JS overhead.
 */
export default function ServicesPage() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-[#0c0c0c] text-white selection:bg-white selection:text-black">
      {/* Top Header Navigation */}
      <Navbar theme="dark" active="services" />
      

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-12 py-12 sm:py-20 md:py-24 flex flex-col flex-1 justify-center">
        {/* Section Tag */}
        <div className="flex items-center gap-4 lg:mb-6 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase">
            SERVICES
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-8 sm:mb-16">
          WHAT I DO
        </h1>

        {/* Services Rows List */}
        <div className="w-full border-t border-white/15">
          {services.map((service) => (
            <div
              key={service.id}
              className="group border-b border-white/15 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-12 items-start transition-colors duration-200 hover:bg-white/[0.02] px-2 sm:px-4"
            >
              {/* Category Title */}
              <div className="lg:col-span-6">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase group-hover:text-neutral-100 transition-colors">
                  {service.title}
                </h2>
              </div>

              {/* Column 1 Deliverables */}
              <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
                {service.column1.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-sm sm:text-base text-neutral-400 group-hover:text-neutral-300 font-normal transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Column 2 Deliverables */}
              <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
                {service.column2.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-sm sm:text-base text-neutral-400 group-hover:text-neutral-300 font-normal transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ARCHITECTURAL STATEMENT CONTACT FOOTER                                    */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-7xl mx-auto px-5 sm:px-12 pt-16 sm:pt-24 pb-32 sm:pb-20 select-none">
        <div className=" pt-12 sm:pt-16 flex flex-col">
          {/* Availability Indicator */}
          <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              AVAILABLE FOR NEW INITIATIVES
            </span>
          </div>

          {/* Statement Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 sm:mb-12 max-w-4xl leading-[1.05]">
            LET&apos;S BUILD SOMETHING TOGETHER.
          </h2>

          {/* Action Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            {/* Direct Email */}
            <a
              href="mailto:shreenemane06@gmail.com?subject=Project%20Inquiry"
              className="text-base sm:text-xl md:text-2xl font-medium text-neutral-300 hover:text-white transition-colors underline decoration-neutral-700 hover:decoration-white underline-offset-8 break-all sm:break-normal"
            >
              Contact at: shreenemane06@gmail.com
            </a>

            {/* CTA & Channels */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="mailto:shreenemane06@gmail.com?subject=Project%20Inquiry"
                className="bg-white text-neutral-950 hover:bg-neutral-200 active:scale-95 transition-all rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide inline-flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Start a Project</span>
                <span>→</span>
              </a>
              <a
                href="https://github.com/shree-nemane"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white border border-white/20 hover:border-white/50 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/shreedarshan-nemane-455417329"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white border border-white/20 hover:border-white/50 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
