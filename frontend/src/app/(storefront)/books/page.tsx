"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

export default function BooksPage() {
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const addToCart = (e: React.MouseEvent, book: Book) => {
    e.preventDefault(); // Prevent navigating to book details
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const cartKey = user ? `cart_${user._id || user.id}` : "cart_guest";
      const storedCart = localStorage.getItem(cartKey);
      let currentCart = JSON.parse(storedCart || "[]");
      
      if (!Array.isArray(currentCart)) {
        currentCart = [];
      }

      const existingItem = currentCart.find((item: any) => item.book_id === book._id);
      if (existingItem) {
        const nextQuantity = existingItem.quantity + 1;
        if (book.stock > 0 && nextQuantity > book.stock) {
          existingItem.quantity = book.stock;
          showToast(`Only ${book.stock} item(s) left in stock.`, "warning");
        } else {
          existingItem.quantity = nextQuantity;
          showToast(`${book.title} added to cart!`, "success");
        }
        existingItem.stock = book.stock;
      } else {
        currentCart.push({
          book_id: book._id,
          title: book.title,
          price: book.price,
          quantity: 1,
          stock: book.stock,
          image_url: book.image_url
        });
        showToast(`${book.title} added to cart!`, "success");
      }
      localStorage.setItem(cartKey, JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">Book Catalog</h1>
          <p className="text-gray-500">Explore our collection of premium books.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search titles or authors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-32 text-gray-500 bg-gray-50 rounded-3xl border border-gray-100">
          No books found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredBooks.map((book) => (
            <Link key={book._id} href={`/books/${book._id}`} className="group flex flex-col h-full">
              <div className="bg-gray-50 rounded-2xl aspect-[2/3] mb-5 overflow-hidden relative border border-gray-100">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
                )}
                {book.stock <= 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">{book.category || 'Uncategorized'}</div>
                <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2 group-hover:text-black text-gray-900 transition-colors">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                <div className="flex items-center justify-between mt-auto pt-4">
                  <span className="font-semibold text-lg">${book.price.toFixed(2)}</span>
                  <button 
                    onClick={(e) => addToCart(e, book)}
                    disabled={book.stock <= 0}
                    className="bg-gray-100 text-black p-2.5 rounded-full hover:bg-black hover:text-white transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
