import { Star, CheckCircle, Quote } from "lucide-react";

const TESTIMONIALS_ROW1 = [
  {
    name: "Alex Nguyen",
    role: "Software Engineer",
    text: "MicroBooks completely changed the way I buy books. The interface is incredibly smooth and checkout is lightning fast.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    date: "2 days ago"
  },
  {
    name: "Sarah Linh",
    role: "UX Designer",
    text: "Rich collection, smart search, and the book recommendations are actually helpful. 10/10 experience!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    date: "1 week ago"
  },
  {
    name: "David Le",
    role: "Product Manager",
    text: "Reasonable prices with great seasonal promotions. The real-time order tracking feature is very convenient.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    date: "just now"
  },
  {
    name: "Hannah Pham",
    role: "University Professor",
    text: "I often buy academic textbooks and research papers. MicroBooks has everything and the service is very dedicated.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah",
    date: "3 days ago"
  },
];

const TESTIMONIALS_ROW2 = [
  {
    name: "Victor Thang",
    role: "Startup Founder",
    text: "Buying business books on MicroBooks is effortless. The category-based suggestion system is very intelligent.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victor",
    date: "5 days ago"
  },
  {
    name: "James Tuan",
    role: "Data Scientist",
    text: "A huge selection of Machine Learning and AI books. I found rare titles that other shops didn't have.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    date: "1 month ago"
  },
  {
    name: "Michael Dung",
    role: "Systems Engineer",
    text: "The payment system is fast and secure. Books are packed with shockproof material very carefully.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    date: "2 weeks ago"
  },
  {
    name: "Sophia Thao",
    role: "PhD Candidate",
    text: "An amazing shopping experience. The app loads fast, and I can find any book I'm looking for.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    date: "4 days ago"
  },
];

export const TrustedByCarousel = () => {
  const fullRow1 = [...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1];
  const fullRow2 = [...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2];

  return (
    <section className="py-32 bg-gray-50/50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-50" />

      <div className="max-w-7xl mx-auto px-6 mb-20 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-md border border-gray-100 mb-6">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Reader Community
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6">
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">+1 Million</span> Readers
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
          Thousands of positive reviews from book lovers around the world. 
          We are proud to be the leading platform for knowledge sharing.
        </p>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* Row 1 */}
        <div className="flex w-[200%] animate-scroll-left hover:[animation-play-state:paused]">
          {fullRow1.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-[200%] animate-scroll-right hover:[animation-play-state:paused]">
          {fullRow2.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ item }: { item: any }) => (
  <div className="flex-shrink-0 w-[420px] mx-4 p-8 bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-500 group relative">
    {/* Quote Icon */}
    <div className="absolute top-6 right-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
      <Quote className="w-16 h-16 text-black fill-black" />
    </div>

    <div className="flex items-center gap-5 mb-6">
      <div className="relative">
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-[3px] opacity-20 group-hover:opacity-50 transition-opacity" />
        <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full border-2 border-white relative z-10 object-cover shadow-sm" />
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900 flex items-center gap-1.5 leading-none mb-1">
          {item.name}
          <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-600/10" />
        </div>
        <div className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none">{item.role}</div>
      </div>
    </div>

    <div className="flex items-center gap-1 mb-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{
            fill: i < item.rating ? "#f59e0b" : "none",
            color: i < item.rating ? "#f59e0b" : "#e5e7eb",
          }}
        />
      ))}
    </div>

    <p className="text-gray-900 text-[17px] leading-[1.6] font-bold mb-6 relative z-10">
      "{item.text}"
    </p>

    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
      <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
        Verified Purchase
      </div>
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        {item.date}
      </div>
    </div>
  </div>
);
