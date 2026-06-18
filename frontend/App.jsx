import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import DetailsCard from "./components/DetailsCard.jsx";
import Outcomes from "./components/Outcomes.jsx";
import FAQ from "./components/FAQ.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import EnquiryList from "./components/EnquiryList.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import SyllabusManual from "./components/SyllabusManual.jsx";
import ChatbotWindow from "./components/ChatbotWindow.jsx";
import { Sparkles, Bot, GraduationCap, ChevronDown, Flame, LogIn, Users } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Initialize session checks from localStorage safely on client boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kidrove_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to restore parent session:", err);
    }
  }, []);

  const handleRegistrationSuccess = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem("kidrove_user", JSON.stringify(authenticatedUser));
    handleRegistrationSuccess(); // sync any registrations on login
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("kidrove_user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("kidrove_user");
    handleRegistrationSuccess();
  };

  const scrollToSection = (id) => {
    setCurrentPage("home");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Define virtual Guest account for visitors to play in RoboBuddy Simulator
  const guestUser = {
    id: "guest",
    name: "Guest Scholar",
    email: "guest@kidrove.com",
    role: "student",
    roboBuddy: {
      name: "TrapperBot-007",
      color: "#4f46e5",
      eyeColor: "#f59e0b",
      antennaType: "radar",
      powerCore: "indigo",
      commandsRunCount: 4,
      level: 1,
      exp: 50
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/20 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* 1. Header Navbar */}
        <Header 
          user={user} 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onOpenAuth={() => setAuthOpen(true)} 
          onSignOut={handleLogout} 
        />

        {/* 2. Main Page Views Router */}
        {currentPage === "home" && (
          <div className="animate-fade-in-slow">
            {/* Hero Section */}
            <Hero />

            {/* Promotional interactive banner strip */}
            <div className="bg-indigo-900 text-white py-4 overflow-hidden relative border-y border-indigo-950">
              <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-center md:text-left">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="text-xs sm:text-sm font-bold tracking-tight">
                    Earn an accredited <span className="text-amber-300 font-black font-sans">Kidrove Certified Junior AI & Robotics Engineer</span> badge upon camp graduation!
                  </span>
                </div>
                <button
                  onClick={() => scrollToSection("enrollment-form-section")}
                  className="cursor-pointer text-xs font-extrabold tracking-wider bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2 rounded-lg transition"
                >
                  Claim Your Spot &gt;
                </button>
              </div>
            </div>

            {/* Workshop Details Section */}
            <DetailsCard />

            {/* Learning Outcomes Section */}
            <Outcomes />

            {/* Registration Form */}
            <RegistrationForm onSuccess={handleRegistrationSuccess} />

            {/* FAQ Section */}
            <FAQ />
          </div>
        )}

        {currentPage === "simulator" && (
          <div className="animate-fade-in bg-slate-900 min-h-[90vh]">
            {/* If guest, display a warning bar to sign up */}
            {!user && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 py-3.5 px-4 font-bold text-center flex flex-col sm:flex-row gap-3 items-center justify-center border-b border-amber-450 text-xs shadow-md">
                <span className="flex items-center gap-1.5 font-extrabold font-sans">
                  <Flame className="w-4.5 h-4.5 animate-bounce text-slate-950" />
                  <span>Interactive Guest Preview! Create or log into your portal account to save system level-ups permanently on the server.</span>
                </span>
                <button 
                  onClick={() => setAuthOpen(true)}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-black px-4.5 py-1.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition cursor-pointer flex items-center space-x-1 uppercase text-[10px]"
                >
                  <LogIn className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Sign In / Create Account 🔑</span>
                </button>
              </div>
            )}
            
            <StudentDashboard 
              user={user || guestUser} 
              onUpdateUser={user ? handleUpdateUser : () => {}} 
              onLogout={handleLogout} 
              refreshRegistryTrigger={handleRegistrationSuccess}
            />
          </div>
        )}

        {currentPage === "syllabus" && (
          <div className="animate-fade-in">
            <SyllabusManual />
          </div>
        )}

        {currentPage === "registry" && (
          <div className="animate-fade-in">
            {/* Submissions list */}
            <div className="bg-slate-100 py-10 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <span className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 font-mono">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Central Registry Database</span>
                </span>
                <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                  Academic Admissions Pipeline
                </h1>
                <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1 font-semibold leading-relaxed">
                  Inspect lead distributions in real time mapping to the MongoDB/JSON file storage. Use parent credentials to decrypt personal phone fields.
                </p>
              </div>
            </div>
            
            <EnquiryList user={user} refreshKey={refreshCounter} onRefreshNeeded={handleRegistrationSuccess} />
          </div>
        )}

        {currentPage === "chatbot" && (
          <div className="animate-fade-in">
            <ChatbotWindow />
          </div>
        )}
      </div>

      {/* 8. Footer Section */}
      <Footer />

      {/* Interactive Authorization overlay popups */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}
