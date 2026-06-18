import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, Loader2, Key } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignUp ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please check parameters.");
      }

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || "Network credentials mismatch.");
    } finally {
      setLoading(false);
    }
  };

  const loadDemoAdmin = () => {
    setEmail("admin@kidrove.com");
    setPassword("admin123");
    setIsSignUp(false);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="auth_modal_overlay">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col" id="auth_modal_content">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white font-bold text-2xl rounded-2xl shadow-md mb-3">
            🤖
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {isSignUp ? "Create Student Account 🚀" : "Parent/Student Portal ⚡"}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isSignUp 
              ? "Gain live sandbox access & RoboBuddy customizer" 
              : "Login with standard credentials or try admin monitor"}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-955 px-4 py-3 rounded-2xl text-xs font-semibold mb-4 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
              Secret Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full font-black text-xs sm:text-sm shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing secure authentication...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isSignUp ? "Sign Up For Dynamic Camp" : "Enter Dashboard Portal"}</span>
              </>
            )}
          </button>
        </form>

        {/* Guest Demo Helper Trigger */}
        {!isSignUp && (
          <button
            onClick={loadDemoAdmin}
            className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition border border-indigo-100 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Load Quick Admin Demo Details (admin@kidrove.com)</span>
          </button>
        )}

        {/* Toggle Sign Up / Sign In link */}
        <div className="text-center mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <span>{isSignUp ? "Already registered with dynamic credentials?" : "New to Kidrove interactive system?"}</span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="ml-1 text-indigo-600 font-extrabold hover:underline block mx-auto mt-1 cursor-pointer"
          >
            {isSignUp ? "Login Instead" : "Create Account (It's Free!)"}
          </button>
        </div>

      </div>
    </div>
  );
}
