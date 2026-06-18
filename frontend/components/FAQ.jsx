import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      id: "prior-exp",
      question: "Is prior coding or electronics experience required?",
      answer: "Absolutely not! This workshop is crafted from scratch specifically for young beginners (ages 8-14). We start with easy-to-use visual drag-and-drop block coding interfaces, making it fun and accessible before showing any advanced code syntax.",
    },
    {
      id: "recordings",
      question: "What if my child misses a class? Will recordings be provided?",
      answer: "Yes, definitely. Every single session is recorded live. Full class replay links, along with step-by-step code portfolios and review slides, are uploaded to our secure student dashboard immediately after the session.",
    },
    {
      id: "software-needed",
      question: "What software and devices are needed to join the workshop?",
      answer: "All your child needs is a computer (Windows PC, Mac, or Chromebook) with a reliable internet connection, a web browser (preferably Google Chrome), and Zoom installed for live interactive streaming. No expensive hardware purchases or complex installations are needed!",
    },
    {
      id: "mentorship",
      question: "How do children ask questions during classes?",
      answer: "Our classes maintain a tight 15:1 student-to-mentor ratio. Each virtual breakout room has dedicated instructors ready to support participants, review shared screens, and solve code bugs in real-time.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white" id="faq_section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-1 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Got Questions?</span>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Frequently Asked Questions 🤔
          </h2>
          <p className="mt-2 text-base text-slate-500 font-semibold">
            Find immediate insights for some of the most common student and parent inquiries.
          </p>
        </div>

        {/* Accordion UI list */}
        <div className="space-y-4" id="faq_accordion_container">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={item.id}
                id={`faq_item_${item.id}`}
                className={`border rounded-[1.8rem] transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/30"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left font-black text-slate-900 text-base focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="text-xl">💡</span>
                    <span>{item.question}</span>
                  </div>
                  <span className="shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-600 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300" />
                    )}
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 border-t border-indigo-150/50 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-5 bg-white text-slate-600 text-sm font-semibold leading-relaxed">
                    {item.answer}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Additional assist footer prompt */}
        <div className="mt-10 text-center bg-indigo-50/40 border border-indigo-100 rounded-[2rem] p-6">
          <p className="text-sm font-bold text-indigo-900">
            Have different questions about curriculum or schedules?
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">Our support staff is happy to chat! Reach out via support@kidrove.com</p>
        </div>

      </div>
    </section>
  );
}
