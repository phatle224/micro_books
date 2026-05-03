"use client";

import { useState, useEffect } from "react";

type Token = { text: string; color: string };
type Scene = { title: string; subtitle: string; tokens: Token[] };

const SCENES: Scene[] = [
  {
    title: "zsh — microbooks",
    subtitle: "Starting all services",
    tokens: [
      { text: "$ ", color: "text-emerald-400" },
      { text: "docker compose up --build\n\n", color: "text-gray-100" },
      { text: "[+] ", color: "text-gray-500" },
      { text: "Building microbooks stack...\n", color: "text-gray-400" },
      { text: " ✓  ", color: "text-emerald-400" },
      { text: "kafka             ", color: "text-sky-300" },
      { text: "healthy   ", color: "text-emerald-400" },
      { text: "2.1s\n", color: "text-gray-500" },
      { text: " ✓  ", color: "text-emerald-400" },
      { text: "mongodb-books     ", color: "text-sky-300" },
      { text: "healthy   ", color: "text-emerald-400" },
      { text: "1.8s\n", color: "text-gray-500" },
      { text: " ✓  ", color: "text-emerald-400" },
      { text: "mongodb-orders    ", color: "text-sky-300" },
      { text: "healthy   ", color: "text-emerald-400" },
      { text: "2.0s\n", color: "text-gray-500" },
      { text: " ✓  ", color: "text-emerald-400" },
      { text: "inventory-svc     ", color: "text-violet-300" },
      { text: "started   ", color: "text-emerald-400" },
      { text: "3.2s\n", color: "text-gray-500" },
      { text: " ✓  ", color: "text-emerald-400" },
      { text: "order-svc         ", color: "text-yellow-300" },
      { text: "started   ", color: "text-emerald-400" },
      { text: "3.4s\n", color: "text-gray-500" },
      { text: " ✓  ", color: "text-emerald-400" },
      { text: "frontend          ", color: "text-pink-300" },
      { text: "started   ", color: "text-emerald-400" },
      { text: "4.1s\n\n", color: "text-gray-500" },
      { text: "inventory-svc  ", color: "text-violet-300" },
      { text: "INFO  ", color: "text-gray-500" },
      { text: "Connected to MongoDB\n", color: "text-gray-300" },
      { text: "inventory-svc  ", color: "text-violet-300" },
      { text: "INFO  ", color: "text-gray-500" },
      { text: "Kafka consumer listening → ", color: "text-gray-300" },
      { text: "'order_created'\n", color: "text-emerald-400" },
      { text: "order-svc      ", color: "text-yellow-300" },
      { text: "INFO  ", color: "text-gray-500" },
      { text: "Kafka producer ready\n", color: "text-gray-300" },
      { text: "frontend       ", color: "text-pink-300" },
      { text: "INFO  ", color: "text-gray-500" },
      { text: "▲ Next.js 16 ready on ", color: "text-gray-300" },
      { text: ":3000", color: "text-sky-400" },
    ],
  },
  {
    title: "zsh — microbooks",
    subtitle: "Order flow: Frontend → Order Service → Kafka → Inventory",
    tokens: [
      { text: "# user checks out from frontend\n\n", color: "text-gray-500" },
      { text: "→  ", color: "text-sky-400" },
      { text: "frontend       ", color: "text-pink-300" },
      { text: "POST ", color: "text-yellow-300" },
      { text: "localhost:3001/api/orders\n", color: "text-gray-300" },
      { text: "   customer:  ", color: "text-gray-500" },
      { text: '"Nguyen Van A"\n', color: "text-emerald-400" },
      { text: "   items:     ", color: "text-gray-500" },
      { text: "Clean Code", color: "text-gray-200" },
      { text: " × 1  ", color: "text-gray-500" },
      { text: "($29.99)\n", color: "text-emerald-400" },
      { text: "             ", color: "text-gray-500" },
      { text: "Designing Data-Intensive App", color: "text-gray-200" },
      { text: " × 2  ", color: "text-gray-500" },
      { text: "($49.99)\n\n", color: "text-emerald-400" },
      { text: "←  ", color: "text-violet-400" },
      { text: "order-svc      ", color: "text-yellow-300" },
      { text: "✓  order ", color: "text-emerald-400" },
      { text: "#68b2f1a ", color: "text-sky-300" },
      { text: "saved to MongoDB\n", color: "text-gray-300" },
      { text: "   order-svc      ", color: "text-yellow-300" },
      { text: "→  publish event → ", color: "text-gray-400" },
      { text: "kafka:order_created\n\n", color: "text-orange-300" },
      { text: "←  ", color: "text-violet-400" },
      { text: "inventory-svc  ", color: "text-violet-300" },
      { text: "⬇  consumed order ", color: "text-sky-400" },
      { text: "#68b2f1a\n", color: "text-sky-300" },
      { text: "   inventory-svc  ", color: "text-violet-300" },
      { text: "✓  ", color: "text-emerald-400" },
      { text: '"Clean Code"              ', color: "text-gray-200" },
      { text: "stock ", color: "text-gray-500" },
      { text: "24", color: "text-gray-400" },
      { text: " → ", color: "text-gray-600" },
      { text: "23\n", color: "text-emerald-400" },
      { text: "   inventory-svc  ", color: "text-violet-300" },
      { text: "✓  ", color: "text-emerald-400" },
      { text: '"Designing Data-Intensive"  ', color: "text-gray-200" },
      { text: "stock ", color: "text-gray-500" },
      { text: "11", color: "text-gray-400" },
      { text: " → ", color: "text-gray-600" },
      { text: "9\n\n", color: "text-emerald-400" },
      { text: "←  ", color: "text-violet-400" },
      { text: "frontend       ", color: "text-pink-300" },
      { text: "201 ", color: "text-emerald-400" },
      { text: '{ order_id: "68b2f1a", status: "pending" }', color: "text-gray-300" },
    ],
  },
  {
    title: "zsh — microbooks",
    subtitle: "Live stats across both services",
    tokens: [
      { text: "$ ", color: "text-emerald-400" },
      { text: "curl ", color: "text-gray-100" },
      { text: "localhost:3002", color: "text-sky-400" },
      { text: "/api/books/stats/summary\n\n", color: "text-gray-300" },
      { text: "  total_books       ", color: "text-sky-300" },
      { text: "142\n", color: "text-orange-300" },
      { text: "  total_stock     ", color: "text-sky-300" },
      { text: "4,821\n", color: "text-orange-300" },
      { text: "  out_of_stock        ", color: "text-sky-300" },
      { text: "3", color: "text-red-400" },
      { text: "   ⚠\n", color: "text-yellow-400" },
      { text: "  low_stock           ", color: "text-sky-300" },
      { text: "8", color: "text-yellow-400" },
      { text: "   ⚠\n", color: "text-yellow-400" },
      { text: "  inventory_value  ", color: "text-sky-300" },
      { text: "$12,450.00\n\n", color: "text-emerald-400" },
      { text: "$ ", color: "text-emerald-400" },
      { text: "curl ", color: "text-gray-100" },
      { text: "localhost:3001", color: "text-sky-400" },
      { text: "/api/orders/stats/summary\n\n", color: "text-gray-300" },
      { text: "  total_orders    ", color: "text-yellow-300" },
      { text: "1,204\n", color: "text-orange-300" },
      { text: "  pending            ", color: "text-yellow-300" },
      { text: "47\n", color: "text-yellow-400" },
      { text: "  shipped           ", color: "text-yellow-300" },
      { text: "312\n", color: "text-sky-300" },
      { text: "  delivered         ", color: "text-yellow-300" },
      { text: "891\n", color: "text-emerald-400" },
      { text: "  total_revenue   ", color: "text-yellow-300" },
      { text: "$38,920.00\n\n", color: "text-emerald-400" },
      { text: "  all services ", color: "text-gray-500" },
      { text: "✓ ", color: "text-emerald-400" },
      { text: "operational", color: "text-emerald-400" },
    ],
  },
];

function getTotalChars(tokens: Token[]) {
  return tokens.reduce((s, t) => s + t.text.length, 0);
}

export function MacCodeWindow() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  const scene = SCENES[sceneIndex];
  const totalChars = getTotalChars(scene.tokens);

  useEffect(() => {
    if (phase === "typing") {
      if (charCount >= totalChars) {
        const t = setTimeout(() => setPhase("holding"), 2200);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setCharCount((c) => c + 1), 22);
      return () => clearTimeout(t);
    }
    if (phase === "holding") {
      const t = setTimeout(() => setPhase("erasing"), 0);
      return () => clearTimeout(t);
    }
    // erasing — fast
    if (charCount <= 0) {
      setSceneIndex((i) => (i + 1) % SCENES.length);
      setPhase("typing");
      return;
    }
    const t = setTimeout(() => setCharCount((c) => Math.max(0, c - 6)), 10);
    return () => clearTimeout(t);
  }, [charCount, phase, totalChars]);

  let remaining = charCount;
  const rendered = scene.tokens.map((token, i) => {
    if (remaining <= 0) return null;
    const visible = token.text.slice(0, remaining);
    remaining -= token.text.length;
    return (
      <span key={`${sceneIndex}-${i}`} className={token.color}>
        {visible}
      </span>
    );
  });

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.45)] bg-[#141420] border border-white/[0.07] text-left w-full max-w-2xl mx-auto">
      {/* Title bar */}
      <div className="bg-[#1e1e2e] px-4 py-3 flex items-center gap-2 border-b border-white/[0.06] select-none">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="mx-auto text-[11px] text-gray-400 font-mono">{scene.title}</span>
        <div className="flex items-center gap-1.5">
          {SCENES.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === sceneIndex ? "bg-emerald-400 scale-110" : "bg-gray-600"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Subtitle strip */}
      <div className="bg-[#1a1a28] px-5 py-2 border-b border-white/[0.04] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-gray-500 font-mono tracking-wide">{scene.subtitle}</span>
      </div>

      {/* Terminal output */}
      <div className="px-5 py-5 min-h-[16rem] font-mono text-[13px] leading-[1.75]">
        <pre className="whitespace-pre-wrap">
          {rendered}
          {phase === "typing" && (
            <span className="inline-block w-[7px] h-[13px] bg-gray-300 align-text-bottom animate-[blink_1s_step-end_infinite] ml-px opacity-80" />
          )}
        </pre>
      </div>
    </div>
  );
}
