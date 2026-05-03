"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Tự động đóng sau 4 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Container chứa các Toast */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl 
              border min-w-[300px] animate-fade-in-up
              ${toast.type === "success" ? "bg-white border-green-100 text-green-800" : ""}
              ${toast.type === "error" ? "bg-white border-red-100 text-red-800" : ""}
              ${toast.type === "warning" ? "bg-white border-orange-100 text-orange-800" : ""}
              ${toast.type === "info" ? "bg-white border-blue-100 text-blue-800" : ""}
            `}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
            {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-orange-500" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
            
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
