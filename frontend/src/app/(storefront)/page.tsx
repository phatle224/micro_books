"use client";

import { useState, useEffect } from "react";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    fetch("http://localhost:3002/api/books/?limit=4")
      .then((res) => res.json())
      .then((data) => setFeaturedBooks(data.books || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="px-6 pt-16 pb-32 max-w-7xl mx-auto text-center">
      {/* Reviews Badge */}
      <div
        className="inline-flex items-center gap-2 mb-8 animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.2s" }}
      >
        <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
          <Star className="w-3.5 h-3.5 fill-black text-black" />
        </div>
        <span className="text-sm font-medium text-black">Over 1M+ books delivered worldwide</span>
      </div>

      {/* Main Heading */}
      <h1
        className="text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-5 animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.3s" }}
      >
        Read Smarter. Discover More.<br />
        <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent font-medium">
          Knowledge Powers You Up.
        </span>
      </h1>

      {/* Subheading */}
      <p
        className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.4s" }}
      >
        Explore thousands of titles across all genres. Carefully curated collections delivered right to your door with lightning-fast checkout.
      </p>

      {/* CTA Button */}
      <div
        className="mb-24 animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.5s" }}
      >
        <Link href="/books" className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors">
          Browse Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Featured Books Section */}
      <div 
        className="text-left animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.6s" }}
      >
        <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-semibold tracking-tight">Featured Books</h2>
          <Link href="/books" className="text-sm font-medium hover:underline flex items-center gap-1">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <Link key={book._id} href={`/books/${book._id}`} className="group block border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-lg transition-all bg-white flex flex-col h-full text-left">
              <div className="bg-gray-50 rounded-xl aspect-[2/3] mb-4 overflow-hidden relative border border-gray-100">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-500 mb-1">{book.category}</div>
                <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="font-semibold text-lg">${book.price.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals Banner */}
      <div 
        className="mt-24 rounded-3xl overflow-hidden relative bg-black text-white text-left p-12 md:p-16 flex items-center animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.7s" }}
      >
        {/* Subtle background gradient pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-600 via-black to-black"></div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">New Arrivals for Spring</h2>
          <p className="text-gray-300 mb-8 text-lg">Discover the most anticipated releases of the season. Hand-picked by our editors.</p>
          <Link href="/books?category=new" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            Shop New Arrivals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Company Logos */}
      <div
        className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.8s" }}
      >
        <div className="font-bold text-xl tracking-tighter">PENGUIN</div>
        <div className="font-bold text-xl flex items-center gap-1">
          <span className="w-6 h-6 rounded-full bg-black block"></span>
          HarperCollins
        </div>
        <div className="font-semibold text-lg flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>
          </div>
          Macmillan
        </div>
      </div>
    </div>
  );
}
