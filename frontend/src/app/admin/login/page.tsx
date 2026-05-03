"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Invalid credentials.");
        }
        const data = await res.json();
        if (data.user?.role !== "admin") {
          throw new Error("Admin access required.");
        }
        localStorage.setItem("admin_token", data.access_token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        router.push("/admin");
      })
      .catch((err) => {
        setError(err.message || "Login failed.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-md animate-fade-in-up">
        
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Admin Portal</h1>
          <p className="text-sm text-gray-500 mb-8">Secure access for MicroBooks administrators.</p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Email</label>
              <input 
                required 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                placeholder="admin@microbooks.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Master Password</label>
              <input 
                required 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 pt-1"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-black transition-colors font-medium">
            ← Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
