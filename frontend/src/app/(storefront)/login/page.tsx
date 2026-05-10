"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import Turnstile from "@/components/storefront/Turnstile";

export default function UserLogin() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [captchaToken, setCaptchaToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const returnUrl = searchParams.get("returnUrl") || "/";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captcha_token: captchaToken }),
      });

      if (!res.ok) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authUpdated"));
      showToast("Welcome back!", "success");
      router.push(returnUrl);
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
        
        <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight">Welcome back</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="#" className="text-xs text-gray-500 hover:text-black font-medium transition-colors">Forgot password?</Link>
            </div>
            <input 
              required 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all bg-gray-50/50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-center py-2">
            <Turnstile onVerify={useCallback((token: string) => setCaptchaToken(token), [])} />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !captchaToken}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-black font-medium hover:underline">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
