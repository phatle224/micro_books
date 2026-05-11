"use client";

import { useEffect, useRef } from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
}

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function Turnstile({ onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  // Update ref when onVerify changes without triggering useEffect
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    let widgetId: string | null = null;
    let timer: NodeJS.Timeout;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        // Clear previous widget if any (shouldn't happen with cleanup but just in case)
        containerRef.current.innerHTML = "";
        
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
        });
      } else {
        timer = setTimeout(renderWidget, 500);
      }
    };

    renderWidget();

    return () => {
      if (timer) clearTimeout(timer);
      if (window.turnstile && widgetId) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          console.error("Error removing turnstile widget", e);
        }
      }
    };
  }, [siteKey]); // Only re-render if siteKey changes

  return <div ref={containerRef} className="cf-turnstile"></div>;
}
