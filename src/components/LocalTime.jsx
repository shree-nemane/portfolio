"use client";

import React, { useEffect, useRef } from "react";

export default function LocalTime({ className = "", title }) {
  const timeRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (!timeRef.current) return;
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      timeRef.current.textContent = `${hours}:${formattedMinutes} ${ampm}`;
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span ref={timeRef} className={className} title={title} />;
}
