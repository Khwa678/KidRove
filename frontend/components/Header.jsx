import React from "react";
import { Bot, Sparkles, Calendar, LogIn, Award, UserCheck } from "lucide-react";

export default function Header({ user, currentPage, onPageChange, onOpenAuth, onSignOut }) {
  const scrollToForm = () => {
    onPageChange("home");
    setTimeout(() => {
      const formElement = document.getElementById("enrollment-form-section");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const menuItems = [
    { id: "home", label: "🏠 Home Hub" },
    { id: "chatbot", label: "💬 RoboAdvisor AI" },
    { id: "simulator", label: "🚀 RoboLabs Playground" },
    { id: "syllabus", label: "📚 Curriculum Syllabus" },
    { id: "registry", label: "📊 Live Registry" }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-100 shadow-sm" id="header_main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo Brand */}
        <div 
          className="flex items-center space-x-2.5 group cursor-pointer shrink-0" 
          onClick={() => onPageChange("home")}
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Kid<span className="text-indigo-600">rove</span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">
              AI & ROBOTICS PORTAL
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Pages Menus */}
        <nav className="flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/40">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-indigo-750 shadow-sm font-black"
                    : "text-slate-500 hover:text-slate-950 hover:bg-white/40"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right action control stack */}
        <div className="flex items-center space-x-2 shrink-0">
          
          <div className="hidden lg:flex items-center space-x-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-[11px] text-amber-800 font-bold">
            <Calendar className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>Starts 15 July</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onPageChange("simulator")}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-black text-indigo-700 hover:bg-indigo-100 transition cursor-pointer flex items-center space-x-1"
              >
                <UserCheck className="w-3 h-3 shrink-0 text-indigo-600" />
                <span>Hi, {user.name.split(" ")[0]} ⚙️</span>
              </button>

              <button
                onClick={onSignOut}
                className="px-2.5 py-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-full text-xs font-bold transition cursor-pointer"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-extrabold transition cursor-pointer"
            >
              <LogIn className="w-3 h-3 text-indigo-400" />
              <span>Portal Login</span>
            </button>
          )}

          <button
            id="header_cta_enroll"
            onClick={scrollToForm}
            className="cursor-pointer font-black px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-full transition-all shadow-[0_3px_0_0_#d97706] active:translate-y-0.5 active:shadow-none text-xs"
          >
            Enroll Slots →
          </button>
        </div>

      </div>
    </header>
  );
}
