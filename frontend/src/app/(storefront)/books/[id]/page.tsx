"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Minus,
  BookOpen,
  Tag,
  Barcode,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

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

interface BookView {
  id: string;
  label: string;
  mainStyle: CSSProperties;
  thumbStyle: CSSProperties;
}

const BOOK_VIEWS: BookView[] = [
  {
    id: "front",
    label: "Front",
    mainStyle: { objectPosition: "center", filter: "none", transform: "none" },
    thumbStyle: { objectPosition: "center", filter: "none" },
  },
  {
    id: "back",
    label: "Back",
    mainStyle: {
      objectPosition: "center",
      filter: "brightness(0.85) sepia(0.15)",
      transform: "scaleX(-1)",
    },
    thumbStyle: {
      objectPosition: "center",
      filter: "brightness(0.85) sepia(0.15)",
      transform: "scaleX(-1)",
    },
  },
  {
    id: "detail",
    label: "Detail",
    mainStyle: {
      objectPosition: "top",
      filter: "contrast(1.1) saturate(1.15)",
      transform: "scale(1.4)",
      transformOrigin: "top center",
    },
    thumbStyle: {
      objectPosition: "top",
      filter: "contrast(1.1) saturate(1.15)",
    },
  },
  {
    id: "preview",
    label: "Preview",
    mainStyle: {
      objectPosition: "bottom",
      filter: "brightness(0.9) saturate(0.8)",
      transform: "scale(1.3)",
      transformOrigin: "bottom center",
    },
    thumbStyle: {
      objectPosition: "bottom",
      filter: "brightness(0.9) saturate(0.8)",
    },
  },
];

import { useToast } from "@/context/ToastContext";

export default function BookDetailsPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedView, setSelectedView] = useState("front");

  const currentIndex = BOOK_VIEWS.findIndex((v) => v.id === selectedView);
  const goNext = () => setSelectedView(BOOK_VIEWS[(currentIndex + 1) % BOOK_VIEWS.length].id);
  const goPrev = () => setSelectedView(BOOK_VIEWS[(currentIndex - 1 + BOOK_VIEWS.length) % BOOK_VIEWS.length].id);

  useEffect(() => {
    fetch(`http://localhost:3002/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!book) return;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const cartKey = user ? `cart_${user._id || user.id}` : "cart_guest";
      const storedCart = localStorage.getItem(cartKey);
      let currentCart = JSON.parse(storedCart || "[]");
      if (!Array.isArray(currentCart)) currentCart = [];

      const existingItem = currentCart.find(
        (item: { book_id: string }) => item.book_id === book._id
      );
      
      if (existingItem) {
        // Kiểm tra xem tổng số lượng sau khi thêm có vượt quá tồn kho không
        const totalPotentialQuantity = existingItem.quantity + quantity;
        if (totalPotentialQuantity > book.stock) {
          existingItem.quantity = book.stock;
          showToast(`Chỉ còn ${book.stock} sản phẩm trong kho. Đã cập nhật số lượng tối đa.`, "warning");
        } else {
          existingItem.quantity = totalPotentialQuantity;
          showToast("Đã thêm vào giỏ hàng!", "success");
        }
        // Luôn cập nhật stock mới nhất vào giỏ
        existingItem.stock = book.stock;
      } else {
        currentCart.push({
          book_id: book._id,
          title: book.title,
          price: book.price,
          quantity,
          stock: book.stock,
          image_url: book.image_url,
        });
        showToast("Đã thêm vào giỏ hàng!", "success");
      }
      localStorage.setItem(cartKey, JSON.stringify(currentCart));
      window.dispatchEvent(new Event("cartUpdated"));

      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-40 animate-fade-in-up">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-3">Book Not Found</h1>
        <p className="text-gray-500 mb-6">
          This book doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const inStock = book.stock > 0;
  const activeView = BOOK_VIEWS.find((v) => v.id === selectedView) ?? BOOK_VIEWS[0];

  return (
    <div className="animate-fade-in-up">
      {/* Ambient blurred hero */}
      {book.image_url && (
        <div className="absolute inset-0 h-[560px] overflow-hidden -z-10 pointer-events-none">
          <img
            src={book.image_url}
            alt=""
            className="w-full h-full object-cover scale-110 blur-3xl opacity-20"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-slate-50/85 to-slate-50" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Catalog
        </Link>

        <div className="grid md:grid-cols-[360px_1fr] gap-14 lg:gap-20 items-start">
          {/* ── Left: Main Image ── */}
          <div className="md:sticky md:top-24">
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute -bottom-4 left-4 right-4 h-full bg-black/10 rounded-2xl blur-2xl" />
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/60 shadow-2xl shadow-black/20 bg-gray-100 group">
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                      style={activeView.mainStyle}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                      <BookOpen className="w-12 h-12" />
                      <span className="text-sm">No Cover Available</span>
                    </div>
                  )}

                  {/* Prev / Next arrows — hiện khi hover */}
                  {book.image_url && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* View label badge */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {activeView.label}
                  </div>
                </div>

                {/* Dot indicators */}
                {book.image_url && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {BOOK_VIEWS.map((view, i) => (
                      <button
                        key={view.id}
                        onClick={() => setSelectedView(view.id)}
                        className={`rounded-full transition-all duration-200 ${
                          selectedView === view.id
                            ? "w-5 h-2 bg-black"
                            : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={view.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {book.image_url && (
                <div className="flex gap-2 mt-4">
                  {BOOK_VIEWS.map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setSelectedView(view.id)}
                      title={view.label}
                      className="flex-1 flex flex-col items-center gap-1 group"
                    >
                      <div
                        className={`w-full aspect-[2/3] rounded-xl overflow-hidden transition-all duration-200 ${
                          selectedView === view.id
                            ? "ring-2 ring-black ring-offset-2 shadow-md"
                            : "ring-1 ring-gray-200 opacity-55 hover:opacity-100 hover:ring-gray-400"
                        }`}
                      >
                        <img
                          src={book.image_url}
                          alt={view.label}
                          className="w-full h-full object-cover"
                          style={view.thumbStyle}
                        />
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                          selectedView === view.id
                            ? "text-black"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        {view.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {book.category}
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4 text-gray-900">
              {book.title}
            </h1>

            <p className="text-lg text-gray-500 mb-8 font-medium">
              by {book.author}
            </p>

            <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent mb-8" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl font-bold tracking-tight">
                ${book.price.toFixed(2)}
              </span>
              {inStock && (
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  In Stock
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white/60 backdrop-blur-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!inStock || quantity <= 1}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) {
                      setQuantity(1);
                    } else if (val > book.stock) {
                      setQuantity(book.stock);
                      showToast(`Chỉ còn ${book.stock} sản phẩm trong kho`, "warning");
                    } else {
                      setQuantity(val);
                    }
                  }}
                  className="w-12 text-center font-semibold text-sm bg-transparent border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  disabled={!inStock || quantity >= book.stock}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={addToCart}
                disabled={!inStock || added}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-300 ${
                  added
                    ? "bg-green-600 text-white scale-95"
                    : inStock
                    ? "bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-7 mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
                About this book
              </h3>
              <p className="text-gray-700 leading-[1.85] text-base">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* Book details table */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden">
              {book.category && (
                <div className="flex items-center justify-between px-5 py-3.5 bg-white/60 border-b border-gray-100">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" /> Category
                  </span>
                  <span className="text-sm font-medium text-gray-800">{book.category}</span>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center justify-between px-5 py-3.5 bg-white/60 border-b border-gray-100">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Barcode className="w-3.5 h-3.5" /> ISBN
                  </span>
                  <span className="text-sm font-mono text-gray-800">{book.isbn}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-5 py-3.5 bg-white/60">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  {inStock
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    : <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                  Availability
                </span>
                {inStock ? (
                  <span className="text-sm font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                    In Stock · {book.stock} available
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
