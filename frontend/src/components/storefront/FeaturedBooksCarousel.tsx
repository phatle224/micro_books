"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  category: string;
}

export function FeaturedBooksCarousel({ books }: { books: Book[] }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 500);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
            canScrollLeft ? "bg-white hover:border-black shadow-sm" : "bg-gray-50 opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
            canScrollRight ? "bg-white hover:border-black shadow-sm" : "bg-gray-50 opacity-50 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book) => (
          <Link 
            key={book._id} 
            href={`/books/${book._id}`} 
            className="flex-shrink-0 w-[300px] snap-start group/card block border border-orange-100/50 rounded-3xl p-6 hover:border-orange-200 transition-all duration-500 bg-white/60 backdrop-blur-md flex flex-col h-[580px] text-left paper-shadow hover:-translate-y-2"
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: '1200px'
            }}
          >
            <div 
              className="bg-[#f8f5f0] rounded-2xl aspect-[2/3] mb-8 overflow-hidden relative border border-white/40 transition-all duration-700 group-hover/card:translate-z-20 group-hover/card:rotate-y-12 shadow-xl group-hover/card:shadow-[25px_25px_50px_rgba(0,0,0,0.2)] flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {book.image_url ? (
                <img 
                  src={book.image_url} 
                  alt={book.title} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
              )}
              {/* Premium Foil Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-3">{book.category}</div>
              <h3 className="font-serif font-bold text-xl leading-snug mb-3 line-clamp-2 group-hover/card:text-orange-900 transition-colors h-[3.5rem]">{book.title}</h3>
              <p className="text-sm text-slate-500 font-medium italic mb-4">by {book.author}</p>
            </div>
            
            <div className="mt-auto pt-6 border-t border-orange-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-0.5">Price</span>
                <span className="font-black text-2xl text-slate-900 group-hover/card:text-gold transition-all duration-500">${book.price.toFixed(2)}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 translate-x-4 group-hover/card:translate-x-0 transition-all duration-500 shadow-lg">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
