"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Order {
  _id: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
}

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("auth_token");
    if (!storedUser) {
      router.push("/login?returnUrl=/orders");
      return;
    }
    if (!token) {
      router.push("/login?returnUrl=/orders");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    fetch("/api/orders/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("authUpdated"));
          router.push("/login?returnUrl=/orders");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setOrders(data.orders || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-orange-500" />;
      case "confirmed": return <Package className="w-4 h-4 text-blue-500" />;
      case "shipped": return <Truck className="w-4 h-4 text-purple-500" />;
      case "delivered": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">My Orders</h1>
          <p className="text-gray-500">Track your current and past orders.</p>
        </div>
        <Link href="/books" className="text-sm font-medium hover:underline flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
             <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No orders found</h2>
          <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
          <Link href="/books" className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                    order.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                    'bg-blue-50 border-blue-100 text-blue-700'
                  }`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-medium">{item.quantity}x</span>
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </div>
                      <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="text-xl font-semibold">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
