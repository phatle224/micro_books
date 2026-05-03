"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  isbn: string;
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3002/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!book) return;
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = currentCart.find((item: any) => item.book_id === book._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({
        book_id: book._id,
        title: book.title,
        price: book.price,
        quantity: 1,
        image_url: book.image_url
      });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    // Dispatch custom event to update cart badge in Navbar
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`${book.title} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-32 animate-fade-in-up">
        <h1 className="text-2xl font-semibold mb-4">Book Not Found</h1>
        <Link href="/books" className="text-blue-600 hover:underline">Return to catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in-up">
      <Link href="/books" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Book Cover */}
        <div className="aspect-[2/3] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover Available</div>
          )}
        </div>

        {/* Right: Book Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">{book.category}</div>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-2 leading-tight">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{book.author}</p>

          <div className="flex items-end gap-4 mb-6">
            <span className="text-3xl font-semibold">${book.price.toFixed(2)}</span>
          </div>

          <div className="mb-8">
            {book.stock > 0 ? (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 w-fit px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> In Stock ({book.stock} available)
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-red-700 bg-red-50 w-fit px-3 py-1.5 rounded-full">
                <AlertCircle className="w-4 h-4" /> Out of Stock
              </div>
            )}
          </div>

          <button 
            onClick={addToCart}
            disabled={book.stock <= 0}
            className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-12"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {book.description || "No description available for this book."}
            </p>
          </div>

          {book.isbn && (
            <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
              ISBN: <span className="font-mono text-gray-700">{book.isbn}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
