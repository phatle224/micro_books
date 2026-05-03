"use client";

import { useState } from "react";
import { Star, Moon, Sun } from "lucide-react";
import Link from "next/link";
import CartButton from "../../components/storefront/CartButton";
import UserMenu from "../../components/storefront/UserMenu";
import Footer from "../../components/storefront/Footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [readingMode, setReadingMode] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-1000 
      ${readingMode 
        ? 'bg-[#121212] text-orange-50/90 selection:bg-orange-500 selection:text-white' 
        : 'bg-[#fdfbf7] text-slate-900 selection:bg-orange-200 selection:text-slate-900'
      }`}>
      {/* Premium Multi-layered Background */}
      <div className={`fixed inset-0 z-[0] overflow-hidden pointer-events-none transition-all duration-1000 ${readingMode ? 'vignette-dark' : 'vignette'}`}>
        
        {/* Layer 1: Animated Grain/Noise (Organic Feel) */}
        <div className="absolute inset-[-100%] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] animate-grain pointer-events-none"></div>

        {/* Layer 2: Paper Grain Texture (Static) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${readingMode ? 'opacity-[0.01]' : 'opacity-[0.04]'} bg-[url('https://www.transparenttextures.com/patterns/felt-paper.png')]`}></div>
        
        {/* Layer 3: Soft Ambient Glows */}
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b transition-colors duration-1000 ${readingMode ? 'from-orange-950/20 via-transparent' : 'from-orange-50/60 via-transparent'} to-transparent`}></div>
        <div className={`absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ${readingMode ? 'bg-orange-900/10' : 'bg-orange-200/20'}`}></div>
        <div className={`absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ${readingMode ? 'bg-orange-800/5' : 'bg-orange-100/30'}`}></div>

        {/* Layer 4: Victorian Corner Ornaments */}
        <div className={`absolute top-10 left-10 w-32 h-32 transition-all duration-1000 ${readingMode ? 'opacity-[0.03] text-orange-200' : 'opacity-[0.08] text-orange-900'}`}>
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L40,0 C40,0 10,10 0,40 Z M15,15 C25,15 35,25 35,35 M5,25 C5,35 15,45 25,45" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className={`absolute bottom-10 right-10 w-32 h-32 rotate-180 transition-all duration-1000 ${readingMode ? 'opacity-[0.03] text-orange-200' : 'opacity-[0.08] text-orange-900'}`}>
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 L40,0 C40,0 10,10 0,40 Z M15,15 C25,15 35,25 35,35 M5,25 C5,35 15,45 25,45" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Layer 5: Ink Stains / Literary Watermarks */}
        <div className={`absolute top-[15%] left-[-5%] w-[450px] h-[450px] transition-all duration-1000 ${readingMode ? 'opacity-[0.01]' : 'opacity-[0.04]'} pointer-events-none animate-drift`}>
          <svg viewBox="0 0 200 200" fill="currentColor" className="text-orange-900">
            <path d="M100,10 C120,30 150,20 170,40 C190,60 160,90 180,110 C200,130 170,170 140,180 C110,190 80,160 60,170 C40,180 10,150 20,120 C30,90 10,60 30,40 C50,20 80,0 100,10 Z" />
          </svg>
        </div>
        <div className={`absolute top-[40%] left-[2%] font-serif italic text-7xl transition-all duration-1000 ${readingMode ? 'text-orange-100 opacity-[0.02]' : 'text-orange-950 opacity-[0.06]'} pointer-events-none -rotate-90 origin-left select-none tracking-widest`}>
          VERITAS IN SCRIPTIS
        </div>
        <div className={`absolute top-[60%] right-[2%] font-serif italic text-7xl transition-all duration-1000 ${readingMode ? 'text-orange-100 opacity-[0.02]' : 'text-orange-950 opacity-[0.06]'} pointer-events-none rotate-90 origin-right select-none tracking-widest`}>
          SCIENTIA POTENTIA EST
        </div>

        {/* Layer 6: Floating Literary Elements (Quill & Pages) */}
        <div className={`absolute bottom-40 left-12 transition-all duration-1000 opacity-[0.04] -rotate-[30deg] ${readingMode ? 'text-orange-100' : 'text-orange-950'}`}>
          <svg width="80" height="240" viewBox="0 0 100 300" fill="currentColor">
            <path d="M50,280 C40,260 30,220 35,180 C40,140 60,100 65,60 C67,40 60,20 50,10 C40,20 33,40 35,60 C40,100 60,140 65,180 C70,220 60,260 50,280 Z" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute bottom-[-150px] animate-float-page opacity-0"
              style={{
                left: `${10 + i * 12}%`,
                animationDelay: `${i * 2.5}s`,
                animationDuration: `${18 + i * 4}s`
              }}
            >
              <div className={`w-10 h-14 border transition-all duration-1000 rounded-sm shadow-sm ${readingMode ? 'bg-orange-50/5 border-orange-200/10' : 'bg-white border-orange-100/50'}`}>
                <div className="w-6 h-0.5 bg-current opacity-10 mt-3 ml-2"></div>
                <div className="w-4 h-0.5 bg-current opacity-10 mt-1.5 ml-2"></div>
                <div className="w-5 h-0.5 bg-current opacity-10 mt-1.5 ml-2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Sliding Toggle Component */}
        <div className="fixed bottom-10 right-10 pointer-events-auto z-50">
          <div className="flex flex-col items-end gap-3">
            <div className={`px-4 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-700 shadow-sm ${readingMode ? 'bg-orange-950/60 border-orange-800 text-orange-200' : 'bg-white/90 border-orange-100 text-slate-500'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {readingMode ? 'Midnight Reading' : 'Classic Parchment'}
              </span>
            </div>
            <button 
              onClick={() => setReadingMode(!readingMode)}
              className={`relative w-20 h-10 rounded-full p-1.5 transition-all duration-700 shadow-2xl border ${readingMode ? 'bg-orange-950/50 border-orange-800' : 'bg-[#fdfbf7] border-orange-200'} hover:scale-105 active:scale-95`}
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-700 shadow-lg ${readingMode ? 'translate-x-10 bg-orange-200' : 'translate-x-0 bg-slate-900'}`}
              >
                {readingMode ? (
                  <Moon className="w-4 h-4 text-orange-950 fill-orange-950" />
                ) : (
                  <Sun className="w-4 h-4 text-white fill-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Subtle classic border line */}
        <div className={`absolute inset-8 border transition-all duration-1000 pointer-events-none hidden lg:block ${readingMode ? 'border-orange-200/5' : 'border-orange-900/5'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-700 border-b ${readingMode ? 'bg-[#1a1a1a]/80 border-orange-900/20' : 'bg-[#fdfbf7]/80 border-orange-100'}`}>
          <nav className="px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto animate-fade-in-up">
            <Link href="/" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${readingMode ? 'bg-orange-200' : 'bg-slate-900'}`}>
                <Star className={`w-4 h-4 ${readingMode ? 'fill-orange-950 text-orange-950' : 'fill-white text-white'}`} />
              </div>
              <span className={`text-xl font-serif font-bold tracking-tight transition-colors duration-500 ${readingMode ? 'text-orange-50' : 'text-slate-900'}`}>MicroBooks</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link href="/books?category=all" className={`text-sm font-medium transition-colors ${readingMode ? 'text-orange-100/60 hover:text-orange-200' : 'text-slate-600 hover:text-orange-700'}`}>
                Categories
              </Link>
              <Link href="/books?sort=bestsellers" className={`text-sm font-medium transition-colors ${readingMode ? 'text-orange-100/60 hover:text-orange-200' : 'text-slate-600 hover:text-orange-700'}`}>
                Best Sellers
              </Link>
              <Link href="/books?sort=authors" className={`text-sm font-medium transition-colors ${readingMode ? 'text-orange-100/60 hover:text-orange-200' : 'text-slate-600 hover:text-orange-700'}`}>
                Authors
              </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <UserMenu />
              <CartButton />
            </div>
          </nav>
        </header>

        <main className="flex-1 relative overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
