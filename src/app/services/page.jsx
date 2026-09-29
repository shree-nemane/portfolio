import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { services } from "../../data/services";

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
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
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

      {/* Subtle Footer Bridge */}
      <footer className="w-full pt-8 pb-32 sm:py-8 px-[2%] flex items-center justify-end text-sm text-neutral-600 select-none">
        <Link
          href="/work"
          data-transition-label="WORK GALLERY"
          className="text-white p-2 px-4  text-lg hover:text-neutral-400 transition-colors"
        >
          <span className="text-white text-lg">&#91; </span>
          Explore Work Gallery →
          <span className="text-white text-lg"> &#93;</span>
        </Link>
      </footer>
    </main>
  );
}
