import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { projects } from "../data/projects";

/**
 * Home Page (React Server Component)
 * Clean, minimalist Swiss editorial flagship presentation.
 * Uses client-side leaf component (<Navbar />) for interactivity
 * while keeping main layout and typography statically rendered on the server.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between bg-[#F4F4F2] text-[#171717] overflow-x-hidden selection:bg-black selection:text-white">
      {/* Top Header Navigation */}
      <Navbar theme="light" active="home" />

      {/* Middle Section: Row with View Gallery Button */}
      <div className="w-full flex items-center justify-end px-4 sm:px-[2%] z-20 select-none my-auto py-4 pt-8 sm:pt-16">
        {/* Right tag: Refined Gradient PROJECTS Button */}
        <Link
          href="/work"
          data-transition-label="WORK GALLERY"
          className="group relative inline-flex items-center cursor-pointer active:scale-95 transition-transform duration-200"
        >
          {/* Subtle luminous ambient gradient glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neutral-400/20 via-neutral-600/30 to-black/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

          {/* Smooth Button Body */}
          <div className="relative flex items-center gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs hover:shadow-md transition-all duration-300">
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              View Gallery
            </span>
            <span className="text-xs font-normal text-neutral-400">
              ({String(projects.length).padStart(2, '0')})
            </span>
            <span className="inline-block text-xs transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      </div>

      {/* Bottom Section: Name + Role + Bio */}
      <div className="w-full px-4 sm:px-[2%] pb-28 md:pb-6 lg:pb-[5vh] pt-4 z-20 select-none">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Left: Refined, Professional Name & Title */}
          <div className="flex flex-col gap-2">
            <span className="text-xs sm:text-sm font-medium tracking-widest text-neutral-500 uppercase pl-16 sm:pl-32 md:pl-40">
              Product &amp; Visual Designer
            </span>

            <div className="relative inline-block">
              {/* Standing illustration standing right on top of the name */}
              <div className="absolute bottom-full left-1 sm:left-3 md:left-5 -mb-0.5 sm:-mb-1 z-10 pointer-events-none select-none">
                <Image
                  src="/shree-standing.png"
                  alt="Shree Nemane standing"
                  width={344}
                  height={344}
                  priority
                  className="h-36 sm:h-52 md:h-64 lg:h-[344px] w-auto object-contain drop-shadow-xs"
                />
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold tracking-tight text-neutral-900 leading-[0.95]">
                <span className="block overflow-hidden">
                  <span className="inline-block animate-mask-slide-up [animation-delay:80ms]">
                    SHREE
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="inline-block animate-mask-slide-up [animation-delay:220ms]">
                    NEMANE
                  </span>
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Bio / Introduction */}
          <div className="flex flex-col lg:text-right gap-3 lg:max-w-[420px] pb-1">
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-normal">
              Crafting thoughtful digital interfaces, design systems, and brand experiences for forward-thinking products and studios.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
