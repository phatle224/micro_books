import { Star, AtSign, MessageCircle, Heart, Share2, Mail, MapPin, ArrowRight, Rss, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 relative overflow-hidden selection:bg-white selection:text-black">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section: CTA / Newsletter */}
        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[3rem] p-12 md:p-16 mb-24 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-medium tracking-widest uppercase text-xs">
                <Zap className="w-4 h-4 fill-blue-400" />
                Stay Ahead of the Curve
              </div>
              <h3 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 leading-tight">
                Curated knowledge, <br />
                <span className="text-white/50 italic">delivered weekly.</span>
              </h3>
              <p className="text-gray-400 text-lg font-light max-w-sm">
                Join 5,000+ developers and thinkers who receive our weekly digests.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 outline-none focus:border-white/40 transition-all text-lg font-light placeholder:text-white/20"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-white text-black rounded-full px-8 hover:bg-gray-200 transition-colors font-semibold flex items-center gap-2">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-white/20 px-8">
                No spam. Only quality content. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Col */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-transform duration-500 shadow-xl shadow-white/5">
                <Star className="w-6 h-6 fill-black text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">MicroBooks</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Elevating the reading experience through modern technology. We curate only the most essential publications for the digital age.
            </p>
            <div className="flex items-center gap-4">
              {[AtSign, MessageCircle, Heart, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-10">Collections</h4>
            <ul className="space-y-4">
              {["All Publications", "Engineering", "Design", "Philosophy", "Limited Editions"].map((link, i) => (
                <li key={i}>
                  <Link href="/books" className="text-gray-500 hover:text-white transition-all text-sm font-medium hover:pl-2 flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-white/0 group-hover:bg-white transition-all rounded-full" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-10">Company</h4>
            <ul className="space-y-4">
              {["Our Mission", "Architecture", "Careers", "Journal", "Security"].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-500 hover:text-white transition-all text-sm font-medium hover:pl-2 flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-white/0 group-hover:bg-white transition-all rounded-full" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-8">Base</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Headquarters</p>
                    <p className="text-gray-500 text-xs mt-1">District 1, HCMC, VN</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Inquiries</p>
                    <p className="text-gray-500 text-xs mt-1">hello@microbooks.io</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 flex-wrap justify-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold italic">
              © {currentYear} MicroBooks Collective
            </p>
            <div className="flex gap-6 items-center border-l border-white/10 pl-8">
              <span className="flex items-center gap-1.5 text-[10px] text-white/20 uppercase tracking-widest font-bold hover:text-white transition-colors cursor-pointer">
                <Shield className="w-3 h-3" /> Privacy
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-white/20 uppercase tracking-widest font-bold hover:text-white transition-colors cursor-pointer">
                <Globe className="w-3 h-3" /> Global
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-8 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="text-[10px] font-black italic tracking-tighter">VISA</span>
            <span className="text-[10px] font-black italic tracking-tighter">STRIPE</span>
            <span className="text-[10px] font-black italic tracking-tighter">MASTERCARD</span>
            <span className="text-[10px] font-black italic tracking-tighter">AMEX</span>
          </div>
        </div>
      </div>

      {/* Finishing Touch: Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </footer>
  );
}
