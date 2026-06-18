import React from "react";
import { Sparkles, Bot, ArrowRight, Zap, Cpu } from "lucide-react";

export default function Hero() {
  const scrollToForm = () => {
    const formElement = document.getElementById("enrollment-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-slate-50 pt-6 pb-12" id="hero_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curved Kidrove Vibrant Palette Container Card */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl">
          
          {/* Decorative shapes behind */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Left: Text Content & Badges */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Vibrant Age Tag */}
              <div className="inline-flex items-center space-x-2 bg-indigo-400/30 rounded-full px-4 py-2 border border-indigo-300/30 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
                <span>Summer 2026 Edition</span>
                <span className="text-indigo-200">|</span>
                <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-extrabold">Ages 8–14 Years</span>
              </div>

              {/* Title with yellow-gold highlight */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight" id="hero_title">
                AI & Robotics<br />
                <span className="text-amber-300">Summer Workshop 🚀</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-indigo-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold" id="hero_desc">
                Unlock the future! A hands-on, 4-week interactive online journey where kids learn to code virtual robots, master AI computational logic, and implement smart home automations.
              </p>

              {/* CTA action handles */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero_btn_enroll"
                  onClick={scrollToForm}
                  className="cursor-pointer w-full sm:w-auto px-8 py-4.5 bg-amber-400 hover:bg-amber-500 text-slate-900 text-base font-black rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Enroll Now — ₹2,999 Only</span>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>
                
                <a
                  href="#outcomes_section"
                  className="w-full sm:w-auto px-6 py-4.5 border border-indigo-400/50 hover:border-white text-white font-bold rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Explore Curriculum</span>
                </a>
              </div>

              {/* Trust highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-indigo-500/40 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-amber-300">100%</span>
                  <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Live & Interactive</span>
                </div>
                <div className="flex flex-col border-l border-indigo-500/30 pl-4">
                  <span className="text-xl sm:text-2xl font-black text-white">No Code</span>
                  <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Experience Needed</span>
                </div>
                <div className="flex flex-col border-l border-indigo-500/30 pl-4">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">₹2,999</span>
                  <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">All-inclusive Fee</span>
                </div>
              </div>

            </div>

            {/* Hero Right: Interactive Toy Robot Frame */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 flex flex-col items-center">
                
                {/* Visual badge inside Robot card */}
                <div className="w-full flex justify-between items-center bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold text-white mb-6">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>RoboBuddy.ai ACTIVE</span>
                  </div>
                  <span className="text-amber-300">Starts 15 July</span>
                </div>

                {/* The Robot Vector Illustration styled directly in high contrast kid theme */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="relative w-full h-full animate-bounce" style={{ animationDuration: "5s" }}>
                    
                    {/* Robot Shape with Vibrant colors */}
                    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
                      {/* Head */}
                      <rect x="35" y="15" width="50" height="42" rx="14" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                      {/* Face mask background */}
                      <rect x="41" y="21" width="38" height="23" rx="8" fill="#1e1842" />
                      {/* Antennas */}
                      <line x1="60" y1="15" x2="60" y2="4" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="60" cy="4" r="5" fill="#f43f5e" className="animate-ping origin-center" />
                      <circle cx="60" cy="4" r="4.5" fill="#f43f5e" />
                      
                      {/* Eyes (super bright led look) */}
                      <circle cx="50" cy="31" r="5" fill="#a7f3d0" />
                      <circle cx="50" cy="31" r="2.5" fill="#10b981" />
                      <circle cx="70" cy="31" r="5" fill="#a7f3d0" />
                      <circle cx="70" cy="31" r="2.5" fill="#10b981" />
                      
                      {/* Body */}
                      <rect x="30" y="65" width="60" height="42" rx="10" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                      {/* Interactive Heart Core glow */}
                      <path d="M60 90 s-4-4-4-7 a4 4 0 0 1 8 0 s0 3-4 7" fill="#f43f5e" />
                    </svg>

                  </div>
                </div>

                {/* Statistics highlight console */}
                <div className="w-full bg-slate-900/90 text-slate-100 rounded-xl p-3.5 font-mono text-[11px] leading-tight mt-6 border border-slate-800">
                  <div className="flex space-x-1.5 mb-2 items-center text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="ml-1 text-[9px] uppercase font-bold tracking-widest text-indigo-300">KIDROVE_CLI</span>
                  </div>
                  <div>
                    <p className="text-emerald-400">&gt; initialising_camp_mode</p>
                    <p className="text-amber-300">&gt; load: AI_Robotics_V2</p>
                    <p className="text-slate-300">&gt; online_seats = &quot;FILLING_FAST&quot;</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
