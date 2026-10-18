"use client";

import React, { useState, useId } from "react";

const REASONS = [
  { id: "idea", label: "I have an idea to build.", subject: "New Project Idea", prompt: "Drop me a line with your name and details here, and I'll get back to you as soon as possible!" },
  { id: "problem", label: "I have a problem to solve.", subject: "Technical / Design Challenge", prompt: "Describe the specific problem or bottleneck, and what you're trying to achieve." },
  { id: "collaborate", label: "Let's collaborate on a project.", subject: "Collaboration Inquiry", prompt: "Tell me about your project, your team, and how you see us collaborating." },
  { id: "hello", label: "Just want to say hello.", subject: "Casual Hello", prompt: "Drop a line to say hi, share something interesting, or start a conversation!" },
  { id: "other", label: "Something else.", subject: "General Inquiry", prompt: "Tell me what's on your mind and how I can help." },
];

const DIRECT_EMAIL = "shreenemane06@gmail.com";

export default function ContactForm() {
  const formId = useId();

  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'submitted'
  const [statusText, setStatusText] = useState("");
  const [errors, setErrors] = useState({});

  const selectedReasonObj = REASONS.find((r) => r.id === reason);
  const currentPlaceholder = selectedReasonObj
    ? selectedReasonObj.prompt
    : "Drop me a line with your name and details here, and I'll get back to you as soon as possible!";

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!message.trim()) {
      errs.message = "Please enter your message.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          reason: selectedReasonObj?.label || "General Inquiry",
          _subject: `[${selectedReasonObj?.subject || "Project Inquiry"}] from ${email.trim()}`,
          message: message.trim(),
          submittedAt: new Date().toISOString(),
          _gotcha: "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("submitted");
        setStatusText("Thank you! Your message has been received. I'll get back to you shortly.");
      } else {
        setStatus("error");
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          setStatusText(data.errors.map((err) => err.message).join(", "));
        } else {
          setStatusText("Failed to send message. Please check the details and try again.");
        }
      }
    } catch (err) {
      console.error("Formspree submission error:", err);
      setStatus("error");
      setStatusText("A network error occurred while submitting. Please check your connection and try again.");
    }
  };

  return (
    <div className="w-full">
      {status === "submitted" ? (
        <div
          role="status"
          aria-live="polite"
          className="py-8 border-y border-neutral-300 flex flex-col gap-4 animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-600">
              DISPATCH CONFIRMED
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-sans">
            Thank you.
          </h3>
          <p className="text-sm text-neutral-700 leading-relaxed max-w-md font-sans">
            {statusText}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setMessage("");
                setEmail("");
                setReason("");
              }}
              className="text-xs font-mono uppercase tracking-wider underline hover:text-black transition-colors cursor-pointer"
            >
              ← Send another note
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col font-sans">
          {/* Honeypot field for bot mitigation - hidden from real visitors */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            style={{ display: "none" }}
            aria-hidden="true"
          />
          {/* ================================================================= */}
          {/* ROW 1: TO · Send me a note                                      */}
          {/* ================================================================= */}
          <div className="flex items-center justify-between py-3 sm:py-3.5  border-neutral-300/80">
            <span className="font-sans italic text-base sm:text-lg text-ink">
              Send me a note
              <br />
              Hii !!
            </span>
          </div>

          {/* ================================================================= */}
          {/* ROW 2: FROM · Your email address.                                 */}
          {/* ================================================================= */}
          <div className="flex items-center py-3 sm:py-3.5   border-y border-neutral-300/80">
           
            <div className="flex-1 min-w-0 flex items-center">
              <input
                id={`${formId}-email`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="Your email address."
                aria-invalid={Boolean(errors.email)}
                className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-neutral-400 placeholder:font-normal focus:outline-hidden font-sans"
              />
              {errors.email && (
                <span className="text-[11px] font-mono text-red-600 uppercase shrink-0 pl-2">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* ROW 3: SUBJECT · Choose a reason for your message.                */}
          {/* ================================================================= */}
          <div className="flex items-center py-3 sm:py-3.5 border-b border-neutral-300/80">
           
            <div className="flex-1 min-w-0 relative flex items-center">
              <select
                id={`${formId}-reason`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-ink focus:outline-hidden appearance-none cursor-pointer pr-6 font-sans"
              >
                <option value="" disabled className="text-neutral-400">
                  Choose a reason for your message.
                </option>
                {REASONS.map((r) => (
                  <option key={r.id} value={r.id} className="text-neutral-900 bg-canvas">
                    {r.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 text-neutral-500 text-xs" aria-hidden="true">
                ⌄
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* ROW 4: MESSAGE · Drop me a line with your name and details...     */}
          {/* ================================================================= */}
          <div className="flex items-start py-3 sm:py-3.5 border-b border-neutral-300/80">
           
            <div className="flex-1 min-w-0">
              <textarea
                id={`${formId}-message`}
                required
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: null }));
                }}
                placeholder={currentPlaceholder}
                aria-invalid={Boolean(errors.message)}
                className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-neutral-400 placeholder:font-normal focus:outline-hidden resize-none leading-relaxed font-sans"
              />
              {errors.message && (
                <span className="block text-[11px] font-mono text-red-600 uppercase pt-1">
                  {errors.message}
                </span>
              )}
            </div>
          </div>

          {/* SUBMISSION ERROR ALERT */}
          {status === "error" && statusText && (
            <div
              role="alert"
              className="mt-4 p-3 border border-red-500/30 bg-red-50/50 text-red-700 text-xs font-sans flex items-center gap-2"
            >
              <span className="font-mono font-bold text-red-600">!</span>
              <span>{statusText}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* ACTION: SEND YOUR MESSAGE (Right-aligned, bold with hover arrow)  */}
          {/* ================================================================= */}
          <div className="pt-6 sm:pt-8 flex justify-end items-center">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all duration-200 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-medium tracking-wide shadow-2xs hover:shadow-xs cursor-pointer inline-flex items-center"
            >
              <span>{status === "submitting" ? "SENDING..." : "SEND YOUR MESSAGE"}</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 font-light" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
