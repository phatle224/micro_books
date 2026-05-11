"use client";

import { useState, useEffect } from "react";
import { Star, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MacCodeWindow } from "@/components/storefront/MacCodeWindow";
import { TechStackCarousel } from "@/components/storefront/TechStackCarousel";
import { FeaturedBooksCarousel } from "@/components/storefront/FeaturedBooksCarousel";
import { TrustedByCarousel } from "@/components/storefront/TrustedByCarousel";
import { fetchJsonResult } from "@/lib/fetchJsonResult";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  image_url: string;
  category: string;
}

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchJsonResult<{ books?: Book[] }>("/api/books?limit=8").then((result) => {
      if (result.ok) {
        setFeaturedBooks(result.data.books || []);
      }
    });
  }, []);

  return (
    <div className="px-6 pt-16 pb-32 max-w-7xl mx-auto text-center relative z-10">
      {/* Reviews Badge */}
      <div
        className="inline-flex items-center gap-2 mb-8 animate-fade-in-up bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm relative z-20"
      >
        <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white">
          <Star className="w-3.5 h-3.5 fill-black text-black" />
        </div>
        <span className="text-sm font-bold text-slate-900">Over 1M+ books delivered worldwide</span>
      </div>

      {/* Main Heading */}
      <h1
        className="text-6xl md:text-8xl lg:text-[100px] font-serif font-bold leading-[0.95] tracking-tight mb-8 animate-fade-in-up text-slate-900"
      >
        Read Book <span className="italic text-orange-700">Smarter.</span><br />
        Discover <span className="text-gold">More.</span>
      </h1>

      {/* Subheading */}
      <p
        className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto animate-fade-in-up font-medium leading-relaxed"
      >
        Where every page is a new journey. Explore our hand-picked collections of rare finds and modern classics.
      </p>

      {/* CTA Button */}
      <div
        className="mb-32 animate-fade-in-up"
      >
        <Link href="/books" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-orange-800 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1">
          Explore the Library <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Mac Code Window */}
      <div
        className="mb-24 animate-fade-in-up"
      >
        <MacCodeWindow />
      </div>

      {/* Tech Stack Carousel */}
      <div
        className="mb-24 animate-fade-in-up"
      >
        <TechStackCarousel />
      </div>

      {/* Featured Books Section */}
      <div
        className="text-left animate-fade-in-up mb-32"
      >
        <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">Featured Books</h2>
            <p className="text-gray-500 font-medium">Hand-picked titles from our curators</p>
          </div>
          <Link href="/books" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <FeaturedBooksCarousel books={featuredBooks} />
      </div>

      {/* New Arrivals Banner */}
      <div
        className="mb-32 rounded-[3rem] overflow-hidden relative bg-slate-950 text-white text-left p-16 md:p-24 flex items-center animate-fade-in-up shadow-2xl"
      >
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_50%,#c2410c,transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Exclusive Collection</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            New Arrivals for <span className="text-gold italic">Spring 2026</span>
          </h2>
          <p className="text-slate-400 mb-10 text-xl leading-relaxed">
            From award-winning novels to rare collector's editions, discover the books that are defining this season.
          </p>
          <Link href="/books?category=new" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full text-base font-bold hover:bg-orange-100 transition-all duration-300 shadow-xl hover:-translate-y-1">
            Explore New Arrivals <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Abstract Book Graphic Overlay */}
        <div className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-20 rotate-[-15deg]">
          <BookOpen className="w-[400px] h-[400px] text-white" strokeWidth={0.5} />
        </div>
      </div>

      {/* Trusted By Carousel */}
      <div
        className="animate-fade-in-up"
      >
        <TrustedByCarousel />
      </div>
    </div>
  );
}
