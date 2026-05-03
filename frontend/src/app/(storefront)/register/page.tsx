"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export default function UserRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const message = res.status === 400 ? "Email already registered." : "Registration failed.";
        setError(message);
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authUpdated"));
      router.push("/");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 animate-fade-in-up">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 fill-white text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight">Create an account</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Join MicroBooks to start exploring.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input 
              required 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all bg-gray-50/50 focus:bg-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input 
              required 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all bg-gray-50/50 focus:bg-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input 
              required 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all bg-gray-50/50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Creating account..." : "Sign up"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
