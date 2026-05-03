"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Nguyễn Minh Khoa",
    role: "Software Engineer",
    avatar: "MK",
    avatarBg: "#dbeafe",
    avatarColor: "#1d4ed8",
    rating: 5,
    text: "MicroBooks đã thay đổi hoàn toàn cách tôi mua sách. Giao diện cực kỳ mượt mà, thanh toán nhanh chóng, và sách về tay trong vòng 2 ngày. Tuyệt vời!",
    book: "Clean Code – Robert C. Martin",
    date: "Tháng 4, 2026",
  },
  {
    id: 2,
    name: "Trần Phương Linh",
    role: "UX Designer tại Toong",
    avatar: "PL",
    avatarBg: "#fce7f3",
    avatarColor: "#be185d",
    rating: 5,
    text: "Kho sách phong phú, tìm kiếm thông minh, và phần đề xuất sách thực sự hữu ích. Tôi đã mua hơn 10 cuốn chỉ trong tháng đầu tiên!",
    book: "The Design of Everyday Things",
    date: "Tháng 4, 2026",
  },
  {
    id: 3,
    name: "Lê Hoàng Duy",
    role: "Product Manager",
    avatar: "HD",
    avatarBg: "#d1fae5",
    avatarColor: "#065f46",
    rating: 5,
    text: "Giá cả hợp lý, có nhiều khuyến mãi theo mùa. Tính năng theo dõi đơn hàng real-time rất tiện. Đây là app mua sách tốt nhất tôi từng dùng.",
    book: "Inspired – Marty Cagan",
    date: "Tháng 3, 2026",
  },
  {
    id: 4,
    name: "Phạm Thị Thu Hà",
    role: "Giáo viên Đại học",
    avatar: "TH",
    avatarBg: "#fef3c7",
    avatarColor: "#92400e",
    rating: 5,
    text: "Tôi thường mua sách giáo khoa và tài liệu học thuật. MicroBooks có đủ cả, thậm chí còn có cả sách tiếng Anh nhập khẩu. Dịch vụ khách hàng rất tận tâm.",
    book: "Atomic Habits – James Clear",
    date: "Tháng 3, 2026",
  },
  {
    id: 5,
    name: "Võ Đức Thắng",
    role: "Startup Founder",
    avatar: "DT",
    avatarBg: "#ede9fe",
    avatarColor: "#5b21b6",
    rating: 5,
    text: "Mua sách kinh doanh trên MicroBooks rất dễ dàng. Hệ thống gợi ý sách theo danh mục rất thông minh. Shipping nhanh hơn cả kỳ vọng!",
    book: "Zero to One – Peter Thiel",
    date: "Tháng 2, 2026",
  },
  {
    id: 6,
    name: "Hoàng Anh Tuấn",
    role: "Data Scientist",
    avatar: "AT",
    avatarBg: "#fee2e2",
    avatarColor: "#991b1b",
    rating: 4,
    text: "Rất nhiều sách về Machine Learning và AI. Tôi tìm được những cuốn hiếm mà các shop khác không có. Ứng dụng load rất nhanh, trải nghiệm mua hàng tốt.",
    book: "Deep Learning – Goodfellow et al.",
    date: "Tháng 2, 2026",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{
            fill: i < rating ? "#f59e0b" : "none",
            color: i < rating ? "#f59e0b" : "#d1d5db",
          }}
        />
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + TESTIMONIALS.length) % TESTIMONIALS.length);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating]
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const getVisible = () => {
    const len = TESTIMONIALS.length;
    return [
      TESTIMONIALS[(current - 1 + len) % len],
      TESTIMONIALS[current],
      TESTIMONIALS[(current + 1) % len],
    ];
  };

  const [prevCard, mainCard, nextCard] = getVisible();

  return (
    <div className="w-full max-w-6xl mx-auto py-24 relative overflow-hidden select-none">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/50 blur-[100px] -z-10 rounded-full animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 blur-[100px] -z-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      {/* ── Header ─────────────────────────── */}
      <div className="text-center mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/50 border border-amber-100 mb-2">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
            Trust & Community
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black">
          Được tin dùng bởi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">+1 Triệu</span> độc giả
        </h2>
        <div className="flex items-center justify-center gap-3 mt-4 text-gray-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium">4.9/5 dựa trên 20,000+ đánh giá thực tế</span>
        </div>
      </div>

      {/* ── 3-Card Carousel ────────────────── */}
      <div className="relative flex items-center justify-center gap-8 perspective-[2000px]">
        {/* Background Reflection/Shadow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-gray-50/30 -z-20 rounded-[3rem] border border-gray-100/50" />

        <div className="hidden lg:block w-80 flex-shrink-0 transition-all duration-700 -rotate-y-12 translate-x-12 scale-90 pointer-events-none">
          <TestimonialCard testimonial={prevCard} mini />
        </div>

        {/* Main Card */}
        <div
          className={`flex-1 max-w-2xl transition-all duration-500 ease-out z-10
            ${isAnimating ? "opacity-0 translate-y-12 scale-95" : "opacity-100 translate-y-0 scale-100"}`}
        >
          <TestimonialCard testimonial={mainCard} main />
        </div>

        <div className="hidden lg:block w-80 flex-shrink-0 transition-all duration-700 rotate-y-12 -translate-x-12 scale-90 pointer-events-none">
          <TestimonialCard testimonial={nextCard} mini />
        </div>
      </div>

      {/* ── Navigation ─────────────────────── */}
      <div className="flex flex-col items-center gap-8 mt-16">
        {/* Pagination Dots */}
        <div className="flex items-center gap-3">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group relative h-2 transition-all duration-500"
              style={{ width: i === current ? "40px" : "8px" }}
            >
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-500
                  ${i === current ? "bg-black" : "bg-gray-200 group-hover:bg-gray-300"}`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            className="w-14 h-14 rounded-full border border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-center hover:border-black transition-all shadow-sm hover:shadow-xl group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
          </button>
          <button
            onClick={next}
            className="w-14 h-14 rounded-full border border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-center hover:border-black transition-all shadow-sm hover:shadow-xl group"
          >
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  main,
  mini,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  main?: boolean;
  mini?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[2.5rem] border transition-all duration-500 flex flex-col gap-8 h-full
        ${main 
          ? "bg-white p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border-gray-50" 
          : "bg-white/50 backdrop-blur-sm p-8 border-gray-100"
        }`}
    >
      {/* Quote Ornament */}
      <div className="absolute top-8 right-12 opacity-[0.03] pointer-events-none">
        <Quote className="w-24 h-24 text-black fill-black" />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`${main ? "w-5 h-5" : "w-3 h-3"} transition-all duration-300`}
              style={{
                fill: i < testimonial.rating ? "#f59e0b" : "none",
                color: i < testimonial.rating ? "#f59e0b" : "#e5e7eb",
              }}
            />
          ))}
        </div>

        {/* Text Body */}
        <p
          className={`font-medium leading-[1.6] tracking-tight text-gray-800
            ${main ? "text-2xl md:text-3xl" : "text-sm"}`}
        >
          "{testimonial.text}"
        </p>

        {/* Book Badge */}
        {!mini && (
          <div className="flex items-center gap-3 w-fit px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white transition-all duration-300">
            <span className="text-lg">📖</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Đang đọc</span>
              <span className="text-xs font-bold text-gray-700">{testimonial.book}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar with Ring */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-200 to-orange-300 blur-[2px] opacity-40" />
            <div
              className={`${main ? "w-14 h-14" : "w-10 h-10"} rounded-full flex items-center justify-center text-sm font-black relative bg-white border-2 border-white shadow-sm`}
              style={{ color: testimonial.avatarColor }}
            >
              <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundColor: testimonial.avatarBg }} />
              {testimonial.avatar}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className={`${main ? "text-lg" : "text-sm"} font-black text-gray-900 leading-tight`}>
              {testimonial.name}
            </div>
            {!mini && (
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {testimonial.role}
              </div>
            )}
          </div>
        </div>

        {main && (
          <div className="hidden md:block px-4 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-100">
            <span className="text-[10px] font-black uppercase tracking-widest">✓ Người mua thực</span>
          </div>
        )}
      </div>
    </div>
  );
}
