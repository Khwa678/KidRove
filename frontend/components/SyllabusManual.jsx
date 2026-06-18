import React, { useState } from "react";
import { BookOpen, Cpu, Globe, GraduationCap, HardDrive, FileText, Download, CheckCircle, Flame, Star, Compass } from "lucide-react";

export default function SyllabusManual() {
  const [activeWeek, setActiveWeek] = useState(1);

  const curriculum = {
    1: {
      title: "Foundations of Microcontrollers & RoboLabs IDE",
      badge: "Week 1",
      difficulty: "Starter",
      description: "Introduce students to absolute robotics basics. We assemble the RoboBuddy framework and learn to communicate with microcontrollers using low-level memory gates.",
      topics: [
        "RoboBuddy schematic diagrams & breadboard connections",
        "Understanding DC Voltages vs standard current protocols",
        "Writing your initial loop commands in the C / Python emulator",
        "Deploying logic tests to blink external visual indicators"
      ],
      activity: "🔬 Lab Challenge: Flash an SOS pulse pattern at fluctuating dynamic frequencies."
    },
    2: {
      title: "Sensory Networks & Obstacle-Navigation Logic",
      badge: "Week 2",
      difficulty: "Intermediate",
      description: "Add human-like responsiveness. Your RoboBuddy maps the physical world to virtual data using ultrasonic distance calculation metrics.",
      topics: [
        "Light intensity sensors & solar orientation calculations",
        "Ultrasonic waves: Time-of-flight mathematical calculations",
        "Constructing if/then/else obstacle defense subroutines",
        "Actuator speed multipliers under dynamic load"
      ],
      activity: "🔬 Lab Challenge: Map path coordinates to automatically dodge objects within 15cm."
    },
    3: {
      title: "Speech & Artificial Neural Classification Networks",
      badge: "Week 3",
      difficulty: "Advanced",
      description: "Make robots intelligent! Students learn how models evaluate vocal commands and process voice frequencies.",
      topics: [
        "Introduction to voice wave data representation",
        "Testing speech trigger activations ('Forward', 'Halt', 'Reverse')",
        "Fuzzy Logic control systems for smooth rotational arcs",
        "How machine learning fits into resource-constrained microchips"
      ],
      activity: "🔬 Lab Challenge: Train and configure vocal voice patterns to steer your RoboBuddy with zero keyboard inputs."
    },
    4: {
      title: "The Internet of Things & Real-Time Cloud telemetry",
      badge: "Week 4",
      difficulty: "Capstone Pro",
      description: "Connect the bot to the global cloud! Your unit will transmit sensor telemetry to our Express backend & save calibration statistics.",
      topics: [
        "Understanding REST API requests and backend storage variables",
        "Managing cloud data feeds & historical logs",
        "Constructing gorgeous Web Dashboard meters using React and Tailwind",
        "Capstone verification: Certificate badges collection"
      ],
      activity: "🔬 Lab Challenge: Stream real-time simulated CPU heat and coordinate maps to our live registrar board."
    }
  };

  const kits = [
    { title: "RoboBuddy Core Core Kit", desc: "Includes MCU Development board, continuous rotation servos, and jumper wires.", icon: Cpu, type: "Included" },
    { title: "Ultrasonic Detection Package", desc: "Dynamic sonar telemetry module with dual-transducers for accurate navigation.", icon: HardDrive, type: "Included" },
    { title: "Cloud Integration Key", desc: "Custom Wi-Fi node processor for remote streaming to our database backend.", icon: Globe, type: "Included" },
  ];

  return (
    <div className="py-12 bg-slate-50/50 min-h-screen" id="syllabus_section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 space-y-4 max-w-4xl">
            <span className="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Full Curriculum Manual</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              A Syllabus Crafted for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Next Generation</span> of Engineers
            </h1>
            <p className="text-slate-300 font-semibold text-sm md:text-base leading-relaxed max-w-2xl">
              We transition kids from passive mobile screen consumers to master system developers. Every student designs, writes code, compiles, and optimizes actual simulated firmware logic, supported by our live cloud database parameters.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => alert("Syllabus PDF downloaded successfully! Starter guidelines package ready in memory.")}
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black px-5 py-3 rounded-full transition shadow-md active:translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Kit Manual (PDF)</span>
              </button>
              <button
                onClick={() => alert("Prerequisites pack validated: Web IDE, USB Drivers link, Chrome 105+ compatible.")}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-black px-5 py-3 rounded-full transition"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>View Starter Prerequisites</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Week Explorer Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation vertical sidebar cards */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
              Course Journey Weeks
            </h3>
            
            <div className="space-y-2">
              {[1, 2, 3, 4].map((weekNum) => {
                const isActive = activeWeek === weekNum;
                const weekKey = weekNum;
                return (
                  <button
                    key={weekNum}
                    onClick={() => setActiveWeek(weekNum)}
                    className={`w-full text-left p-4.5 rounded-3xl border transition-all flex items-start space-x-3.5 cursor-pointer ${
                      isActive
                        ? "bg-white border-indigo-500 shadow-md transform translate-x-1"
                        : "bg-white/40 hover:bg-white border-slate-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-xs font-mono ${
                      isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      W{weekNum}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">
                        {curriculum[weekKey].badge} • {curriculum[weekKey].difficulty}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-0.5 line-clamp-1">
                        {curriculum[weekKey].title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro certification card info */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-[2rem] text-white space-y-3">
              <Star className="w-7 h-7 text-amber-400 fill-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              <h4 className="font-black text-sm">Graduation Badge Award</h4>
              <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
                Complete and submit four distinct verification lab outcomes to receive an verified, share-ready Kidrove Young Engineer badge.
              </p>
            </div>
          </div>

          {/* Deep info details screen */}
          <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-6">
            
            {/* Week detailed title */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div className="space-y-1">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-xs font-black text-amber-800 font-mono">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>Interactive Phase {activeWeek}</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1.5">
                  {curriculum[activeWeek].title}
                </h2>
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {curriculum[activeWeek].difficulty} LEVEL
              </span>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                Learning Objectives Overview
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                {curriculum[activeWeek].description}
              </p>
            </div>

            {/* Key Topics List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                Core Subtopics Covered
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {curriculum[activeWeek].topics.map((topic, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-800 font-bold leading-normal">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity highlights */}
            <div className="p-4 sm:p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
              <div className="font-extrabold text-indigo-950 text-xs sm:text-sm font-sans flex items-center space-x-2">
                <span>{curriculum[activeWeek].activity}</span>
              </div>
              <p className="text-[11px] text-indigo-700 font-semibold mt-1.5 leading-normal">
                Requires combining custom telemetry inputs, debugging motor orientation triggers, and securing valid parameter logs to the test server.
              </p>
            </div>

          </div>

        </div>

        {/* Hardware kit segment */}
        <div className="mt-14 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              Pre-Shipped Companion Hardware Kit
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Every course booking includes robust original hardware modules shipped straight to your shipping address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {kits.map((kit, index) => {
              const IconComp = kit.icon;
              return (
                <div key={index} className="bg-white p-5 border border-slate-200/60 rounded-3xl space-y-3 shadow-xs">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-950 text-sm">{kit.title}</h4>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 font-mono">
                        {kit.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{kit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
