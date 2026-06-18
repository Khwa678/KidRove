import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, MessageSquare, Trash2, Cpu, HelpCircle, Check, ArrowRight } from "lucide-react";
import axios from "axios";

export default function ChatbotWindow() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "model",
      text: "🤖 **BEEP BOOP!** \n\nGreetings and welcome, Future Engineer! I am **RoboAdvisor**, your AI camp companion.\n\nAsk me anything about our **AI & Robotics Summer Camp**, including admissions, curriculum projects, our physical companion kit, or how the RoboLabs simulator works!\n\nHere are some helpful starting questions 👇",
      senderName: "RoboAdvisor",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Suggested quick prompts
  const suggestions = [
    "📅 What is the 4-week curriculum?",
    "💰 How much does enrollment cost?",
    "🛠️ What is in the shipped companion kit?",
    "🏅 How does my kid earn their certificate?"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: `msg_${Date.now()}_u`,
      role: "user",
      text: textToSend,
      senderName: "You",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Build query history for Gemini
    // Limit to last 8 messages for context window focus
    const history = messages
      .filter((msg) => msg.id !== "welcome")
      .slice(-8)
      .map((msg) => ({
        role: msg.role,
        text: msg.text
      }));

    try {
      const response = await axios.post("/api/chatbot", {
        message: textToSend,
        history
      });

      if (response.data && response.data.success) {
        const botMsg = {
          id: `msg_${Date.now()}_b`,
          role: "model",
          text: response.data.text,
          senderName: "RoboAdvisor",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(response.data.message || "Invalid API reply");
      }
    } catch (err) {
      console.error("Advisory bot connection failed:", err);
      const errMsg = {
        id: `msg_${Date.now()}_err`,
        role: "model",
        text: "⚡ **Transmission Interrupted** \n\nI was unable to ping our backend cloud models. Please double check that your server dev environment is fully linked and try resending! 🤖",
        senderName: "System Warning",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to reset your chat session history?")) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          text: "🤖 **Memory banks cleared!**\n\nHow can I help you learn about Kidrove today? Feel free to write a message or select a suggested topic below! 👇",
          senderName: "RoboAdvisor",
          timestamp: new Date()
        }
      ]);
    }
  };

  // Simple clean markdown/formatting renderer for beautiful bold lists in lines
  const renderMessageContent = (text) => {
    return text.split("\n").map((line, idx) => {
      let content = line;

      // Handle bullets
      const bulletMatch = line.match(/^(\s*[-*+•])\s+(.*)/);
      const isBullet = !!bulletMatch;
      let cleanLine = isBullet ? bulletMatch[2] : line;

      // Parse Bold text **bold**
      const boldParts = cleanLine.split(/\*\*([^*]+)\*\*/);
      if (boldParts.length > 1) {
        content = boldParts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return <strong key={pIdx} className="font-extrabold text-slate-900">{part}</strong>;
          }
          return part;
        });
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-4">
            <span className="text-indigo-500 font-bold mt-1 text-xs shrink-0">•</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{content}</span>
          </div>
        );
      }

      // Space lines
      if (!line.trim()) {
        return <div key={idx} className="h-2.5" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="py-12 bg-slate-50/50 min-h-screen" id="chatbot_section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Chassis Layout */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/75 shadow-xl overflow-hidden flex flex-col h-[78vh]">
          
          {/* Header Segment */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 shrink-0 flex items-center justify-between border-b border-indigo-950 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-400 text-white text-xl shadow-md animate-bounce" style={{ animationDuration: "5s" }}>
                🤖
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-black text-base tracking-tight text-white leading-none">
                    RoboAdvisor Counselor
                  </h2>
                  <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Gemini Core Active</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 font-mono">
                  Educational AI Agent & Companion
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              title="Reset Chat History"
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Scrolling Chat Bubble Arena */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 bg-slate-50/30">
            {messages.map((msg) => {
              const isBot = msg.role === "model";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${
                    isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {isBot && (
                    <div className="w-8.5 h-8.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
                      🤖
                    </div>
                  )}

                  <div className="space-y-1 max-w-[82%]">
                    {/* Timestamp and Sender name */}
                    <div className={`flex items-center space-x-1 px-1 ${isBot ? "justify-start" : "justify-end"}`}>
                      <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-350 font-medium">
                        • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Bubble Card */}
                    <div className={`p-4 rounded-3xl border shadow-xs space-y-1.5 ${
                      isBot 
                        ? "bg-white border-slate-100 text-slate-800 rounded-tl-sm"
                        : "bg-indigo-600/90 border-indigo-500/10 text-white rounded-tr-sm"
                    }`}>
                      {isBot ? (
                        renderMessageContent(msg.text)
                      ) : (
                        <p className="text-xs sm:text-sm font-semibold leading-relaxed text-white">
                          {msg.text}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-8.5 h-8.5 bg-amber-400 text-slate-900 font-black text-xs rounded-xl flex items-center justify-center shrink-0">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {/* Chatbot Loading Bubble */}
            {isLoading && (
              <div className="flex items-start gap-3.5 justify-start">
                <div className="w-8.5 h-8.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
                  🤖
                </div>
                <div className="space-y-1 max-w-[80%]">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono px-1">
                    RoboAdvisor
                  </span>
                  <div className="p-4 bg-white border border-slate-100 rounded-3xl rounded-tl-sm shadow-xs flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-450 italic">Synthesizing query gates</span>
                    <div className="flex space-x-1.5 pt-0.5">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Anchor point to auto scroll */}
            <div ref={scrollRef} />
          </div>

          {/* Footer Interactive suggestion chips and Input Bar Panel */}
          <div className="p-4 bg-white border-t border-slate-200/60 block shrink-0">
            
            {/* Quick Suggestion chips */}
            {messages.length < 5 && !isLoading && (
              <div className="pb-3.5 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Topic Helpers:</span>
                </span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion.replace(/[^a-zA-Z0-9\s?]/g, "").trim())}
                    className="p-1 px-3 bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 rounded-full text-xs font-bold text-indigo-755 hover:bg-indigo-100/80 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Actual Form Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about materials, cost, certificate credentials..."
                disabled={isLoading}
                maxLength={400}
                className="flex-1 p-3.5 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl transition cursor-pointer flex items-center justify-center shadow-md active:scale-95 shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>

            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-2 font-mono">
              ⚡ Powered by Kidrove Core server pipelines
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
