"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("auth_token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("authUpdated", checkAuth);
    return () => window.removeEventListener("authUpdated", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    window.dispatchEvent(new Event("authUpdated"));
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-gray-700 hover:text-black font-medium transition-colors">
          Sign In
        </Link>
        <Link href="/register" className="hidden sm:block text-sm bg-gray-100 px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/orders" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
        My Orders
      </Link>
      <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span className="truncate max-w-[100px]">{user.name || user.email.split('@')[0]}</span>
      </div>
      <button 
        onClick={handleLogout}
        className="text-gray-500 hover:text-red-500 transition-colors"
        title="Log out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
