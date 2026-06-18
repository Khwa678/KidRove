import React, { useState, useEffect } from "react";
import { 
  Play, Settings, Terminal as TermIcon, ShieldAlert, BadgeInfo, 
  Sparkles, RefreshCw, Cpu, Award, Download, CheckCircle, Code, Plus, ArrowRight
} from "lucide-react";

export default function StudentDashboard({ user, onUpdateUser, onLogout, refreshRegistryTrigger }) {
  // Initialize buddy stats safely
  const defaultBuddy = {
    name: "RoboBuddy-v2",
    color: "#6366f1",
    eyeColor: "#10b981",
    antennaType: "radar",
    powerCore: "emerald",
    commandsRunCount: 12,
    level: 1,
    exp: 40
  };

  const buddy = user.roboBuddy || defaultBuddy;

  // Form states
  const [buddyName, setBuddyName] = useState(buddy.name);
  const [buddyColor, setBuddyColor] = useState(buddy.color);
  const [buddyEyeColor, setBuddyEyeColor] = useState(buddy.eyeColor);
  const [antennaType, setAntennaType] = useState(buddy.antennaType);
  const [powerCore, setPowerCore] = useState(buddy.powerCore);

  // Command sequences list
  const [commandSequence, setCommandSequence] = useState([
    "INITIALIZE SYSTEM",
    "GLOW HEART CORE",
    "RADAR SCAN"
  ]);
  const [consoleLogs, setConsoleLogs] = useState([
    "&gt; [SYSTEM] RoboBuddy boot status: ONLINE",
    "&gt; Welcome back, " + user.name + "! Code safely."
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // New registry modal/form on dashboard for parents
  const [regChildName, setRegChildName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Load user registrations (matching user's email)
  const fetchMyRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const res = await fetch("/api/enquiries");
      const result = await res.json();
      if (result.success) {
        // filter by email
        const matched = result.data.filter((e) => e.email.trim().toLowerCase() === user.email.toLowerCase());
        setUserRegistrations(matched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  useEffect(() => {
    fetchMyRegistrations();
  }, [user.email]);

  // Click-to-add commands
  const availableCommands = [
    "MOVE FORWARD",
    "TURN LEFT",
    "TURN RIGHT",
    "RADAR SCAN",
    "GLOW HEART CORE",
    "TRIGGER LASER",
    "AUTONOMOUS WALK"
  ];

  const addCommand = (cmd) => {
    setCommandSequence([...commandSequence, cmd]);
  };

  const clearCommands = () => {
    setCommandSequence([]);
  };

  // Run the command simulations and earn values dynamically
  const runSimulation = () => {
    if (commandSequence.length === 0) {
      setConsoleLogs((prev) => [...prev, "&gt; [ERROR] Empty instruction registry. Load commands!"]);
      return;
    }

    setIsRunning(true);
    setConsoleLogs((prev) => [...prev, `&gt; [RUNNING] Starting command stack (${commandSequence.length} lines)...`]);

    // Fast sequential execution feedback simulation
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < commandSequence.length) {
        const cmd = commandSequence[currentStep];
        setConsoleLogs((prev) => [
          ...prev, 
          `&gt; [EXEC] Core executing opcode: "${cmd}" -> SUCCESS`
        ]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Calculate new exp & level
        const runCount = buddy.commandsRunCount + commandSequence.length;
        const addedExp = commandSequence.length * 20;
        let finalExp = buddy.exp + addedExp;
        let finalLevel = buddy.level;

        while (finalExp >= 100) {
          finalLevel += 1;
          finalExp -= 100;
          setConsoleLogs((prev) => [
            ...prev,
            `🎉 LEVEL UP! ${buddyName} reached LEVEL ${finalLevel}! Unlocked deep computational blocks.`
          ]);
        }

        const newBuddyState = {
          name: buddyName,
          color: buddyColor,
          eyeColor: buddyEyeColor,
          antennaType: antennaType,
          powerCore: powerCore,
          commandsRunCount: runCount,
          level: finalLevel,
          exp: finalExp
        };

        // Auto save to backend
        saveRoboBuddyState(newBuddyState);

        setConsoleLogs((prev) => [
          ...prev,
          `&gt; [COMPLETE] Sequence run complete. Earned +${addedExp} EXP (${finalExp}/100 till level ${finalLevel + 1}).`
        ]);
        setIsRunning(false);
      }
    }, 850);
  };

  // Save state back to server
  const saveRoboBuddyState = async (updatedState) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/auth/robobuddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          roboBuddy: updatedState
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("saved");
        onUpdateUser({
          ...user,
          roboBuddy: data.roboBuddy
        });
        setTimeout(() => setSaveStatus("idle"), 2050);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("idle");
    }
  };

  // Manual save settings button
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updatedState = {
      ...buddy,
      name: buddyName,
      color: buddyColor,
      eyeColor: buddyEyeColor,
      antennaType: antennaType,
      powerCore: powerCore
    };
    saveRoboBuddyState(updatedState);
  };

  // Add child registration from dashboard
  const handleRegisterFromDashboard = async (e) => {
    e.preventDefault();
    if (!regChildName.trim() || !regPhone.trim()) return;

    setRegLoading(true);
    setRegSuccess("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regChildName,
          email: user.email,
          phone: regPhone
        })
      });

      const result = await res.json();
      if (result.success) {
        setRegSuccess("Successfully registered " + regChildName + "! Live map and tracker list synchronized.");
        setRegChildName("");
        setRegPhone("");
        fetchMyRegistrations();
        refreshRegistryTrigger(); // notify parent
      } else {
        setRegSuccess("Notice: " + result.message);
      }
    } catch (err) {
      setRegSuccess("Registry error: " + err.message);
    } finally {
      setRegLoading(false);
    }
  };

  const getRankName = (lvl) => {
    if (lvl <= 1) return "Novice Tinkerer 🧭";
    if (lvl <= 2) return "Computational Apprentice 🛠️";
    if (lvl <= 4) return "AI Logic Prodigy 🧙‍♂️";
    return "Cybernetic Master Architect 👑";
  };

  return (
    <section className="bg-slate-900 text-slate-100 py-14" id="dashboard_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-slate-800 gap-4 mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-amber-400 rounded-[1.3rem] flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg border-2 border-white">
              {user.name.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{user.name}'s Interactive Hub</h2>
                <span className="bg-indigo-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded text-white border border-indigo-400">
                  {user.role} workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Calibrated sandbox account linked securely to <span className="text-indigo-400 font-bold">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyRegistrations}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-full text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Force Sync</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/20 rounded-full text-xs font-extrabold transition cursor-pointer"
            >
              Sign Out Hub
            </button>
          </div>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: RoboBuddy Interactive Customizer (Grid span 7) */}
          <div className="lg:col-span-7 bg-slate-955 rounded-[2.5rem] p-6 border border-slate-800/80 shadow-2xl flex flex-col gap-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-400/10 rounded-xl">
                  <Cpu className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Active Simulator</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Tweak, program, and save configuration variables.</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black uppercase text-amber-400 font-mono">
                  Level {buddy.level} &bull; {buddy.exp}/100 EXP
                </span>
                <span className="block text-[10px] font-bold text-indigo-400 mt-0.5">
                  {getRankName(buddy.level)}
                </span>
              </div>
            </div>

            {/* Simulated Live Viewport Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/60 rounded-[2rem] p-5 border border-slate-800/55">
              
              {/* Virtual Robot Vector representing interactive customized values absolutely */}
              <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                
                {/* Glowing Core Orbit */}
                <div 
                  className="absolute w-36 h-36 rounded-full blur-2xl animate-pulse -z-10"
                  style={{
                    backgroundColor: buddyColor,
                    opacity: 0.15,
                    animationDuration: powerCore === "ruby" ? "1.2s" : powerCore === "emerald" ? "2s" : "3s"
                  }}
                ></div>

                {/* Vector Canvas */}
                <div className="w-40 h-40 relative flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
                    {/* Level-based decoration aura */}
                    {buddy.level > 1 && (
                      <circle cx="60" cy="55" r="48" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" className="animate-spin" style={{ animationDuration: "12s" }} />
                    )}

                    {/* Antenna Module representation */}
                    {antennaType === "laser" ? (
                      <>
                        <line x1="60" y1="15" x2="60" y2="2" stroke="#ffffff" strokeWidth="4" />
                        <polygon points="56,2 64,2 60,-6" fill="#f43f5e" className="animate-pulse" />
                      </>
                    ) : antennaType === "radar" ? (
                      <>
                        <line x1="60" y1="15" x2="60" y2="4" stroke="#ffffff" strokeWidth="4" />
                        <ellipse cx="60" cy="4" rx="8" ry="3" fill="none" stroke="#22d3ee" strokeWidth="2" className="animate-ping" />
                        <circle cx="60" cy="4" r="3" fill="#22d3ee" />
                      </>
                    ) : (
                      <>
                        <line x1="60" y1="15" x2="60" y2="6" stroke="#94a3b8" strokeWidth="3" />
                        <circle cx="60" cy="5" r="4.5" fill="#e2e8f0" />
                      </>
                    )}

                    {/* Head Body */}
                    <rect x="35" y="15" width="50" height="42" rx="14" fill={buddyColor} stroke="#ffffff" strokeWidth="2.5" />
                    
                    {/* Face Plate */}
                    <rect x="41" y="21" width="38" height="23" rx="8" fill="#0f172a" />
                    
                    {/* Interactive Eye Assembly */}
                    <circle cx="50" cy="31" r="5" fill={buddyEyeColor} className="transition-all" />
                    <circle cx="50" cy="31" r="2" fill="#ffffff" />
                    <circle cx="70" cy="31" r="5" fill={buddyEyeColor} className="transition-all" />
                    <circle cx="70" cy="31" r="2" fill="#ffffff" />

                    {/* Connection bars */}
                    <rect x="52" y="57" width="16" height="8" fill="#e2e8f0" rx="1" />

                    {/* Outer Body and Power Core Indicators */}
                    <rect x="28" y="65" width="64" height="44" rx="12" fill="#1e293b" stroke="#ffffff" strokeWidth="2" />
                    
                    {/* Power Core status glow */}
                    <circle 
                      cx="60" cy="87" 
                      r={powerCore === "ruby" ? 10 : powerCore === "amber" ? 9 : 8} 
                      fill={powerCore === "ruby" ? "#ef4444" : powerCore === "emerald" ? "#10b981" : powerCore === "amber" ? "#f59e0b" : "#4f46e5"} 
                      className="animate-pulse"
                      style={{ animationDuration: "1s" }}
                    />
                  </svg>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-sm font-black text-slate-100">{buddyName}</span>
                  <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">
                    CMD_RUN_COUNT: {buddy.commandsRunCount}
                  </span>
                </div>

              </div>

              {/* Customizer settings panel */}
              <form onSubmit={handleSaveSettings} className="md:col-span-7 space-y-4">
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    System Identifier Name
                  </label>
                  <input
                    type="text"
                    value={buddyName}
                    onChange={(e) => setBuddyName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Body color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={buddyColor}
                        onChange={(e) => setBuddyColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-400">{buddyColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Visual Eyes
                    </label>
                    <div className="flex items-center space-x-1.5 h-8">
                      {["#10b981", "#3b82f6", "#ef4444", "#f59e0b"].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setBuddyEyeColor(col)}
                          className="w-4.5 h-4.5 rounded-full border transition hover:scale-110 cursor-pointer shrink-0"
                          style={{ 
                            backgroundColor: col,
                            borderColor: buddyEyeColor === col ? "#ffffff" : "transparent"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Antenna Type
                    </label>
                    <select
                      value={antennaType}
                      onChange={(e) => setAntennaType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-white focus:outline-none"
                    >
                      <option value="basic">Classic whip</option>
                      <option value="laser">Laser blaster</option>
                      <option value="radar">Sonar radar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Heart Core Fuel
                    </label>
                    <select
                      value={powerCore}
                      onChange={(e) => setPowerCore(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-white focus:outline-none"
                    >
                      <option value="amber">Amber Glow</option>
                      <option value="emerald">Emerald Spark</option>
                      <option value="ruby">High Fusion Ruby</option>
                      <option value="indigo">Cosmic Blue</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    Changes save on execution
                  </span>
                  <button
                    type="submit"
                    disabled={saveStatus === "saving"}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black transition cursor-pointer"
                  >
                    {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "✓ Calibrated" : "Calibrate & Save"}
                  </button>
                </div>

              </form>
            </div>

            {/* Interactive Block Simulator Workspace Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                  Instruction Pipeline Stack ({commandSequence.length})
                </span>
                <button
                  onClick={clearCommands}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-100 underline cursor-pointer"
                >
                  Reset Sequence
                </button>
              </div>

              {/* Quick blocks selection */}
              <div className="flex flex-wrap gap-2">
                {availableCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => addCommand(cmd)}
                    className="px-2.5 py-1.5 bg-slate-905 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-indigo-300 hover:text-white transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-indigo-500" />
                    <span>{cmd}</span>
                  </button>
                ))}
              </div>

              {/* Instruction List Panel represent visually */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap gap-2 items-center min-h-[50px]">
                {commandSequence.length === 0 ? (
                  <span className="text-xs text-slate-600 font-semibold italic text-center w-full">
                    No logical commands added. Click blocks above to construct variables pipeline.
                  </span>
                ) : (
                  commandSequence.map((cmd, i) => (
                    <div 
                      key={i} 
                      className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold border border-indigo-400 flex items-center space-x-1 shadow-sm"
                    >
                      <span className="text-indigo-300 font-mono text-[9px]">{i + 1}:</span>
                      <span>{cmd}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Run btn */}
                <button
                  onClick={runSimulation}
                  disabled={isRunning || commandSequence.length === 0}
                  className="md:col-span-4 bg-amber-400 hover:bg-amber-500 text-slate-905 disabled:bg-slate-800 disabled:text-slate-505 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Sequence</span>
                </button>

                {/* Console text log viewport wrapper */}
                <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[9px] tracking-tight leading-tight max-h-[85px] overflow-y-auto">
                  <div className="flex items-center space-x-1 mb-1 text-slate-555 border-b border-slate-900 pb-1 justify-between">
                    <span>REACTIVE TERMINAL MONITOR</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-505 animate-pulse"></span>
                  </div>
                  <div className="space-y-0.5">
                    {consoleLogs.map((log, index) => (
                      <p 
                        key={index} 
                        className={
                          log.includes("[ERROR]") ? "text-rose-455" :
                          log.includes("[EXEC]") ? "text-indigo-455" :
                          log.includes("🎉") ? "text-amber-400 font-bold" : "text-emerald-455"
                        }
                        dangerouslySetInnerHTML={{ __html: log }}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Column Right: Family Registry Status & Materials (Grid span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Parent Enrollments matching email */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black tracking-tight font-sans">Active Seats</h3>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-black uppercase">
                  Connected
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                The registrations listed below are verified under your account email: <span className="text-white font-bold">{user.email}</span>.
              </p>

              {loadingRegistrations ? (
                <div className="text-center py-4 text-xs text-slate-500 font-semibold italic">
                  Mapping server database...
                </div>
              ) : userRegistrations.length === 0 ? (
                <div className="bg-slate-900/40 p-4 border border-slate-800/70 rounded-2xl text-center">
                  <p className="text-xs text-slate-500 font-bold">No students registered yet under this email.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Submit enrollment details inside form below to instant sync!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {userRegistrations.map((reg, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-505/10 border border-indigo-505/20 flex items-center justify-center font-bold text-xs text-indigo-400 text-center uppercase">
                          {reg.name.substring(0, 2)}
                        </div>
                        <div>
                          <span className="text-xs font-black block text-slate-200">{reg.name}</span>
                          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Verified Seat Reserved ✓</span>
                        </div>
                      </div>

                      <span className="text-[9px] bg-slate-955 border border-slate-888 px-2 py-1 rounded text-slate-400 font-bold">
                        Summer 2026 Batch
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Incremental booking form inside dashboard */}
              <div className="pt-4 border-t border-slate-900 mt-2">
                <span className="block text-[10px] font-black uppercase text-slate-500 mb-2 font-mono">
                  Register Additional Pupil Slot
                </span>

                {regSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold px-3 py-2 rounded-xl mb-3">
                    {regSuccess}
                  </div>
                )}

                <form onSubmit={handleRegisterFromDashboard} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Child's Full Name"
                      value={regChildName}
                      onChange={(e) => setRegChildName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Guardian Contact Mobile"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer font-sans"
                  >
                    {regLoading ? "Registering..." : "+ Register Child Seat"}
                  </button>
                </form>
              </div>

            </div>

            {/* 2. Materials & Live Links */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl space-y-4 font-sans">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black tracking-tight font-sans">Lecture Materials</h3>
              </div>

              <div className="space-y-3 font-sans">
                <div className="p-3.5 bg-slate-900/60 hover:bg-slate-900 rounded-2xl border border-slate-850 transition">
                  <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">Interactive Block coding sandbox</span>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Kidrove visual simulator is fully optimized for chrome & safari.
                  </p>
                  <a href="https://scratch.mit.edu" target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:underline block font-bold mt-1">
                    Launch scratch sandbox playground &rarr;
                  </a>
                </div>

                <div className="p-3.5 bg-slate-905/60 hover:bg-slate-900 rounded-2xl border border-slate-850 transition">
                  <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">Pre-Camp Setup Checklist</span>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Complete orientation video download and setup zoom workspace details.
                  </p>
                  <button onClick={() => alert("Pre-camp materials downloaded to local downloads directory!")} className="text-[10px] text-amber-400 hover:underline block font-bold mt-1 text-left">
                    Download Checklist (PDF 2.4MB)
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
