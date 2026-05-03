"use client";

import Link from "next/link";
import { LayoutDashboard, Book, ShoppingBag, LogOut, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (!authorized) return null; // Prevent flash of content

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Star className="w-6 h-6 fill-black text-black" />
            <span className="text-xl font-semibold tracking-tight">MicroBooks Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/books" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors">
            <Book className="w-5 h-5" /> Manage Books
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-colors">
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
            ← Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
