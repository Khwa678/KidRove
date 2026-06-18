import React from "react";
import { Brain, Cpu, Terminal, ShieldAlert, Rocket, CheckCircle } from "lucide-react";

export default function Outcomes() {
  const outcomesData = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals",
      description: "Understand the mind of machines! Children discover how computers recognize voices, detect facial expressions, and make decisions using simplified machine learning concepts.",
      iconName: "Brain",
      badge: "Module 1",
      colorTheme: "from-blue-500 to-indigo-600 border-blue-200 text-blue-700 bg-blue-50/50",
    },
    {
      id: "robotics-basics",
      title: "Robotics Basics",
      description: "Explore physical sensors, engines, actuators, and mechanical joints. Virtual simulation tools are utilized to demonstrate how robotic bodies interact with the world.",
      iconName: "Cpu",
      badge: "Module 2",
      colorTheme: "from-rose-500 to-purple-600 border-rose-200 text-rose-700 bg-rose-50/50",
    },
    {
      id: "coding-logic",
      title: "Coding Logic",
      description: "Master sequential rules, computational variables, loop architectures, and if-then conditionals using friendly visual block programming modules.",
      iconName: "Terminal",
      badge: "Module 3",
      colorTheme: "from-emerald-500 to-teal-600 border-emerald-200 text-emerald-700 bg-emerald-50/50",
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      description: "Learn to trace logic errors like a real engineer! Develop deep analytical thinking by deconstructing heavy tasks into manageable modular steps.",
      iconName: "ShieldAlert",
      badge: "Module 4",
      colorTheme: "from-amber-500 to-orange-600 border-amber-200 text-amber-700 bg-amber-50/50",
    },
    {
      id: "smart-automation",
      title: "Smart Automation Projects",
      description: "Build real future tech! Build automated smart lighting, dynamic virtual home assistants, and automated alarms that respond to surrounding stimuli.",
      iconName: "Rocket",
      badge: "Module 5",
      colorTheme: "from-pink-500 to-red-600 border-pink-200 text-pink-700 bg-pink-50/50",
    },
  ];

  const renderIcon = (name, className) => {
    switch (name) {
      case "Brain":
        return <Brain className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Terminal":
        return <Terminal className={className} />;
      case "ShieldAlert":
        return <ShieldAlert className={className} />;
      case "Rocket":
        return <Rocket className={className} />;
      default:
        return <CheckCircle className={className} />;
    }
  };

  return (
    <section className="py-16 md:py-20 bg-slate-50" id="outcomes_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Curriculum</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            What Your Child Will Master 🎯
          </h2>
          <p className="mt-2 text-base text-slate-500 font-semibold">
            Over the 4-week camp, our students go from absolute beginners to programming creative smart solutions.
          </p>
        </div>

        {/* Outcomes Grid/Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {outcomesData.map((outcome) => (
            <div
              key={outcome.id}
              id={`outcome_card_${outcome.id}`}
              className="group flex flex-col bg-white rounded-[2rem] border-2 border-slate-100 hover:border-indigo-600/35 p-6.5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-5">
                {/* Visual Icon Header wrapper */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${outcome.colorTheme.split(" ")[0]} ${outcome.colorTheme.split(" ")[1]} flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  {renderIcon(outcome.iconName, "w-6 h-6")}
                </div>

                {/* Badge Tag */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${outcome.colorTheme.split(" ")[2]} ${outcome.colorTheme.split(" ")[4]} text-slate-700`}>
                  {outcome.badge}
                </span>
              </div>

              {/* Title Outcome */}
              <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {outcome.title}
              </h3>

              {/* Paragraph outcome description */}
              <p className="text-sm text-slate-600 font-semibold leading-relaxed flex-grow">
                {outcome.description}
              </p>

              {/* Step indicator mini line details */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold tracking-widest uppercase">Target Mastery</span>
                <span className="text-xs font-black text-indigo-600">100% Core</span>
              </div>

            </div>
          ))}

          {/* Special Creative Showcase Card slot for visual excitement */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.2rem] p-6.5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
            
            {/* Soft decorative ring inside */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="space-y-3 relative z-10">
              <span className="bg-amber-400 text-slate-900 font-black text-[10px] tracking-widest uppercase px-2.5 py-1 rounded">
                BONUS INCLUDED
              </span>
              <h3 className="text-2xl font-black tracking-tight leading-snug">
                Smart AI Robot Projects! 🤖
              </h3>
              <p className="text-sm text-indigo-100 font-semibold leading-relaxed">
                Every child designs, trains, and displays their own simulated robotic companion in our final virtual graduation ceremony! Showcased live to proud parents.
              </p>
            </div>

            <div className="pt-5 border-t border-indigo-500/30 mt-5 flex items-center space-x-3 relative z-10">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-300">✓</span>
              </div>
              <span className="text-xs font-bold text-indigo-100">Project Portfolio & Certificate</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
