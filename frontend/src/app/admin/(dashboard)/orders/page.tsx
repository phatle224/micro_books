"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Truck, Package, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch("http://localhost:3001/api/orders/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setOrders(data.orders || []);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    await fetch(`http://localhost:3001/api/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'confirmed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'shipped': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck className="w-3.5 h-3.5" /> Shipped</span>;
      case 'delivered': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><PackageCheck className="w-3.5 h-3.5" /> Delivered</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-semibold mb-8">Manage Orders</h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-xs font-mono text-gray-500">{order._id.substring(0,8)}...</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm">{order.customer_name}</div>
                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
