"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Book, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [orderStats, setOrderStats] = useState<any>(null);
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    Promise.all([
      fetch("http://localhost:3001/api/orders/stats/summary", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          router.push("/admin/login");
          return null;
        }
        return res.json();
      }),
      fetch("http://localhost:3002/api/books/stats/summary").then(res => res.json())
    ]).then(([orders, inventory]) => {
      if (!orders) return;
      setOrderStats(orders);
      setInventoryStats(inventory);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-semibold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-semibold">${orderStats?.total_revenue?.toFixed(2) || "0.00"}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-semibold">{orderStats?.total_orders || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Books in Catalog</p>
              <h3 className="text-2xl font-semibold">{inventoryStats?.total_books || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
              <h3 className="text-2xl font-semibold">{inventoryStats?.low_stock || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">{orderStats?.pending_orders || 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">Confirmed</span>
              <span className="font-semibold">{orderStats?.confirmed_orders || 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">Shipped</span>
              <span className="font-semibold">{orderStats?.shipped_orders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivered</span>
              <span className="font-semibold">{orderStats?.delivered_orders || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
