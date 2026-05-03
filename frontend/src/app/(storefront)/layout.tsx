import { Star } from "lucide-react";
import Link from "next/link";
import CartButton from "../../components/storefront/CartButton";
import UserMenu from "../../components/storefront/UserMenu";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen text-black flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
        <Link href="/" className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-black text-black" />
          <span className="text-lg font-semibold tracking-tight">MicroBooks</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/books?category=all" className="text-sm text-gray-700 hover:text-black font-medium transition-colors">
            Categories
          </Link>
          <Link href="/books?sort=bestsellers" className="text-sm text-gray-700 hover:text-black font-medium transition-colors">
            Best Sellers
          </Link>
          <Link href="/books?sort=authors" className="text-sm text-gray-700 hover:text-black font-medium transition-colors">
            Authors
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <UserMenu />
          <CartButton />
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
