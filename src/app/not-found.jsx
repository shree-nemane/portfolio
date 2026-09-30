import React from "react";
import Link from "next/link";
import KineticText from "../components/KineticText";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-[#0c0c0c] text-white p-6 sm:p-12 selection:bg-white selection:text-black">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase select-none">
        <span>[ ERROR · 404 ]</span>
        <span>ROUTE NOT LOCATED</span>
      </div>

      {/* Center Stage Typography */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-12">
        <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-white mb-4 select-none">
          404
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-8">
          The requested coordinate does not exist in this archive.
        </p>

        <Link
          href="/"
          data-transition-label="HOME"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-neutral-300 border-y border-white py-2 hover:text-white uppercase transition-colors"
        >
          {/* <span className="text-white text-lg">&#91; </span> */}
          <span className="hover:opacity-60 transition-opacity">←</span>
          <KineticText text="RETURN HOME" />
          {/* <span className="text-white text-lg"> &#93;</span> */}
        </Link>
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] text-neutral-600 uppercase select-none">
        <span>SHREE NEMANE · PORTFOLIO</span>
        <span>INDEX 2026</span>
      </div>
    </main>
  );
}
