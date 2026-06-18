import React from "react";
import { Mail, Phone, MapPin, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const scrollSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900" id="footer_main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start pb-12 border-b border-white/5">
          
          {/* Logo & Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                🤖
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Kid<span className="text-indigo-400">rove</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Empowering next-gen tech creators since 2020. Our high-octane visual learning syllabus turns screen habits into super skills!
            </p>

            <div className="flex space-x-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Ages 8-14 Years Camp</span>
            </div>
          </div>

          {/* Direct Jumps */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">
              Explore Camp
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <button onClick={() => scrollSection("hero_section")} className="hover:text-amber-400 transition cursor-pointer">
                  Hero Overview
                </button>
              </li>
              <li>
                <button onClick={() => scrollSection("details_section")} className="hover:text-amber-400 transition cursor-pointer">
                  Feature Highlights
                </button>
              </li>
              <li>
                <button onClick={() => scrollSection("outcomes_section")} className="hover:text-amber-400 transition cursor-pointer">
                  Curriculum Outcomes
                </button>
              </li>
              <li>
                <button onClick={() => scrollSection("faq_section")} className="hover:text-amber-400 transition cursor-pointer">
                  Parent FAQs
                </button>
              </li>
              <li>
                <button onClick={() => scrollSection("enrollment-form-section")} className="hover:text-amber-400 transition cursor-pointer">
                  Secure Priority Slot
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-xs font-semibold text-slate-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>support@kidrove.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Kidrove Tech Square, Science Tech Road, Sector 5, Bengaluru, India</span>
              </li>
            </ul>
          </div>

          {/* Certification credentials */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest">
              Digital Accreditations
            </h4>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-black text-amber-400 block tracking-wider leading-none">
                CAMP CERTIFICATION
              </span>
              <p className="text-slate-400 text-xs mt-1.5 font-semibold leading-relaxed">
                Successful graduates receive a verifiable blockchain metadata certificate to share in high school portfolios.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Base */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <p>© 2026 Kidrove Academy. All rights reserved.</p>
          <p className="flex items-center justify-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>for future junior scientists</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
