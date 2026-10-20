import React from "react";
import Navbar from "../../components/Navbar";
import ContactForm from "../../components/ContactForm";
import LocalTime from "../../components/LocalTime";

export const metadata = {
  title: "Contact & Project Inquiries",
  description:
    "Let's create together. Reach out to Shree Nemane — Creative Developer & Software Engineer for digital collaborations, web applications, and new projects.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Shree Nemane",
    description: "Let's create together. Have an idea, a project, or want to collaborate?",
    url: "/contact",
  },
};

/**
 * Contact Page (React Server Component)
 * Single-viewport editorial screen layout tailored to Shree Nemane's visual identity:
 * - Clean bold LET'S CREATE TOGETHER typography
 * - Signature [ 04 / CONTACT ] editorial section tag
 * - Pure line-by-line email client form with right-aligned action
 * - Distinctive Shree.Nemane typographic anchor + status pill
 * Fits completely within screen height on desktop (100vh) without unnecessary scrolling.
 */
export default function ContactPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col justify-between bg-canvas text-ink overflow-x-hidden lg:overflow-hidden selection:bg-neutral-900 selection:text-white font-sans">
      {/* Top Header Navigation */}
      <Navbar theme="light" active="contact" />

      {/* ===================================================================== */}
      {/* MIDDLE SECTION: 2-COLUMN EDITORIAL SPREAD                             */}
      {/* ===================================================================== */}
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 my-auto py-6 sm:py-8 lg:py-2 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-center">
          
          {/* LEFT COLUMN: Large Expressive Headline + Copy + Location/Time */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4 sm:gap-5">
            {/* Signature Editorial Section Tag */}
            <div className="flex items-center gap-2.5 text-[11px] tracking-[0.24em] text-neutral-500 uppercase select-none">
              <span>[ CONTACT ]</span>
            </div>

            {/* Bold Headline with Subtle Mask-Slide-Up Entrance */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] font-black tracking-tight text-ink leading-[0.88] select-none uppercase font-sans">
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:60ms]">Discuss</span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:160ms]">Over</span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block animate-mask-slide-up [animation-delay:260ms]">Tea</span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans max-w-sm pt-1">
              Got an idea, a weird little project, or just want to say hi? My inbox is open. Send me a message, and let’s see where the conversation goes.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-sans text-neutral-700 pt-1 select-none">
              <span className="font-semibold text-neutral-900">India</span>
              <span className="inline-flex items-center gap-1.5 text-neutral-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>Available</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Line-by-Line Email Client Form */}
          <div className="lg:col-span-6 lg:col-start-7 lg:justify-self-end flex flex-col justify-center w-full max-w-xl">
            <ContactForm />
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* BOTTOM FOOTER: Shree.Nemane Display Wordmark + Copyright Pill         */}
      {/* ===================================================================== */}
      <footer className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-24 md:pb-6 lg:pb-7 pt-2 flex items-baseline justify-between gap-4 select-none shrink-0">
        <div className="flex-1 min-w-0">
          <span className="font-sans font-normal tracking-[-0.05em] [word-spacing:1rem] text-ink text-6xl sm:text-7xl md:text-8xl lg:text-[7vw] xl:text-[7.5vw] leading-[0.82] select-none block hover:tracking-normal transition-all duration-500">
            Observe & Learn
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 pb-1 text-xs text-neutral-600 font-sans">
          <span>©{currentYear}</span>
        </div>
      </footer>
    </main>
  );
}
