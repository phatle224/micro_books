"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartButton() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        const cart = JSON.parse(storedCart || "[]");
        const count = Array.isArray(cart) 
          ? cart.reduce((total: number, item: any) => total + (item.quantity || 0), 0)
          : 0;
        setItemCount(count);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setItemCount(0);
      }
    };

    updateCartCount();

    // Custom event listener for when cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    
    // Fallback for storage event (from other tabs)
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <Link href="/cart" className="relative bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
      <ShoppingCart className="w-4 h-4" />
      Cart
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
