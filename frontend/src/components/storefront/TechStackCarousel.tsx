"use client";

/* ─────────────────────────────────────────────
   Tech-Stack Infinite Marquee
   Dùng ảnh thực từ /public/techstack/
   Hover → dừng + hiện tooltip tên / role
───────────────────────────────────────────── */

import { useState } from "react";

const TECHS = [
  { id: "nextjs",          name: "Next.js",          role: "Frontend Framework",   img: "/techstack/nextjs.png",         color: "#000000" },
  { id: "kafka",           name: "Apache Kafka",      role: "Message Broker",       img: "/techstack/kafka.png",          color: "#231F20" },
  { id: "docker",          name: "Docker",            role: "Containerisation",     img: "/techstack/docker.png",         color: "#1D63ED" },
  { id: "dockerhub",       name: "Docker Hub",        role: "Image Registry",       img: "/techstack/dockerhub.jpg",      color: "#0DB7ED" },
  { id: "github_actions",  name: "GitHub Actions",    role: "CI / CD Pipeline",     img: "/techstack/github_actions.png", color: "#2088FF" },
  { id: "k8s",             name: "Kubernetes",        role: "Orchestration",        img: "/techstack/k8s.png",            color: "#326CE5" },
  { id: "grafana",         name: "Grafana",           role: "Observability",        img: "/techstack/grafana.png",         color: "#F46800" },
  { id: "prometheus",      name: "Prometheus",        role: "Metrics",              img: "/techstack/prometheus.jpg",     color: "#E6522C" },
  { id: "loki",            name: "Loki",              role: "Log Aggregation",      img: "/techstack/loki.png",           color: "#FFFFFF" },
  { id: "tempo",           name: "Tempo",             role: "Distributed Tracing",  img: "/techstack/tempo.jpg",          color: "#F8BA00" },
];

/* duplicate để tạo vòng lặp liền mạch */
const ITEMS = [...TECHS, ...TECHS, ...TECHS];

export function TechStackCarousel() {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto py-16 relative overflow-visible">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-32 bg-blue-50/30 blur-[80px] -z-10 rounded-full" />

      {/* ── Header ─────────────────────────── */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-gray-100 mb-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            Tech Stack
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black leading-tight">
          Built for <span className="text-blue-600">Speed</span>
        </h2>
      </div>

      {/* ── Marquee wrapper ────────────────── */}
      <div className="relative pt-16 pb-8 overflow-hidden">
        {/* Track only, no fade overlays */}

        {/* Scrolling Track */}
        <div
          className="flex gap-8 w-max items-center px-12"
          style={{
            animation: "marquee 60s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { setPaused(false); setHovered(null); }}
        >
          {ITEMS.map((tech, idx) => {
            const key = `${tech.id}-${idx}`;
            const isHovered = hovered === key;

            return (
              <div
                key={key}
                className="relative flex flex-col items-center group"
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                style={{ perspective: "1000px" }}
              >
                {/* Tooltip - Ultra Modern Glass */}
                <div
                  className={`absolute -top-20 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-none
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  <div className="bg-white/90 backdrop-blur-xl border border-white p-3 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col items-center min-w-[140px]">
                    <div className="w-8 h-8 mb-2 bg-gray-50 rounded-lg p-1.5">
                      <img src={tech.img} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-[11px] font-black text-gray-900">{tech.name}</div>
                    <div className="text-[8px] text-blue-600 font-bold uppercase tracking-widest mt-1">{tech.role}</div>
                    {/* Arrow */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 backdrop-blur-xl rotate-45 border-r border-b border-white" />
                  </div>
                </div>

                {/* Card Container with Dynamic Glow */}
                <div
                  className={`relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center p-6 transition-all duration-500 ease-out
                    ${isHovered 
                      ? "bg-white scale-110 -translate-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-blue-100" 
                      : "bg-white shadow-md border-gray-100"
                    } border`}
                  style={{
                    boxShadow: isHovered 
                      ? `0 30px 60px -10px ${tech.color}22` 
                      : ""
                  }}
                >
                  <img
                    src={tech.img}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                  />
                  
                  {/* Dynamic Inner Glow */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 rounded-[3rem] opacity-20 blur-3xl -z-10"
                      style={{ backgroundColor: tech.color }}
                    />
                  )}
                </div>

                {/* Tracking Pulse Label */}
                <div
                  className={`mt-8 flex flex-col items-center transition-all duration-500
                    ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-900">
                    {tech.name}
                  </span>
                  <div 
                    className="h-1.5 w-1.5 rounded-full mt-3 animate-pulse" 
                    style={{ backgroundColor: tech.color || '#3b82f6' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .rotate-y-12 {
          transform: rotateY(15deg) rotateX(8deg);
        }
      `}</style>
    </div>
  );
}
