"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: ""
  });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const cartKey = user ? `cart_${user._id || user.id}` : "cart_guest";
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch (e) {
      console.error("Error parsing cart:", e);
      setCartItems([]);
    }

    const storedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("auth_token");
    if (storedUser && authToken) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(authToken);
        setFormData((prev) => ({
          ...prev,
          customer_email: userData.email || prev.customer_email,
          customer_name: userData.name || prev.customer_name,
        }));
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!token) {
      const returnUrl = encodeURIComponent("/checkout");
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    setLoading(true);
    setError("");
    
    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        book_id: item.book_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        setSuccess(true);
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const cartKey = user ? `cart_${user._id || user.id}` : "cart_guest";
        localStorage.removeItem(cartKey);
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authUpdated"));
        const returnUrl = encodeURIComponent("/checkout");
        router.push(`/login?returnUrl=${returnUrl}`);
      } else if (res.status === 409) {
        const data = await res.json();
        setError(data?.detail?.message || "Some items are out of stock.");
      } else {
        setError("Failed to place order.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8">Thank you for your purchase. We've received your order and will process it shortly.</p>
        <p className="text-sm text-gray-400">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in-up">
      <h1 className="text-4xl font-semibold tracking-tight mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                required 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                value={formData.customer_name}
                onChange={e => setFormData({...formData, customer_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                value={formData.customer_email}
                onChange={e => setFormData({...formData, customer_email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                value={formData.customer_phone}
                onChange={e => setFormData({...formData, customer_phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea 
                required 
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                value={formData.customer_address}
                onChange={e => setFormData({...formData, customer_address: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || cartItems.length === 0}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 mt-6"
            >
              {loading ? "Processing..." : `Pay $${subtotal.toFixed(2)}`}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.book_id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-12 bg-gray-100 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">No Cover</div>
                    )}
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium line-clamp-1">{item.title}</span>
                </div>
                <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
