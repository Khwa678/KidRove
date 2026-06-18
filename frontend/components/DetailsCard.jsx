import React from "react";
import { Users, Hourglass, Monitor, BadgeIndianRupee, CalendarRange, Heart } from "lucide-react";

export default function DetailsCard() {
  const detailsData = [
    {
      id: "age-group",
      label: "Age Group",
      value: "8–14 Yrs",
      iconName: "Users",
      colorTheme: {
        bg: "bg-blue-50/70 hover:bg-blue-50",
        text: "text-blue-900",
        border: "border-blue-100",
        accent: "text-blue-500",
      },
    },
    {
      id: "duration",
      label: "Duration",
      value: "4 Weeks",
      iconName: "Hourglass",
      colorTheme: {
        bg: "bg-rose-50/70 hover:bg-rose-50",
        text: "text-rose-900",
        border: "border-rose-100",
        accent: "text-rose-500",
      },
    },
    {
      id: "mode",
      label: "Mode",
      value: "100% Online",
      iconName: "Monitor",
      colorTheme: {
        bg: "bg-emerald-50/70 hover:bg-emerald-50",
        text: "text-emerald-900",
        border: "border-emerald-100",
        accent: "text-emerald-500",
      },
    },
    {
      id: "fee",
      label: "Fee",
      value: "₹2,999 Only",
      iconName: "BadgeIndianRupee",
      colorTheme: {
        bg: "bg-purple-50/70 hover:bg-purple-50",
        text: "text-purple-900",
        border: "border-purple-100",
        accent: "text-purple-500",
      },
    },
    {
      id: "start-date",
      label: "Starts On",
      value: "15 July 2026",
      iconName: "CalendarRange",
      colorTheme: {
        bg: "bg-amber-50/70 hover:bg-amber-50",
        text: "text-amber-900",
        border: "border-amber-100",
        accent: "text-amber-600",
      },
    },
  ];

  const renderIcon = (name, className) => {
    switch (name) {
      case "Users":
        return <Users className={className} />;
      case "Hourglass":
        return <Hourglass className={className} />;
      case "Monitor":
        return <Monitor className={className} />;
      case "BadgeIndianRupee":
        return <BadgeIndianRupee className={className} />;
      case "CalendarRange":
        return <CalendarRange className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  return (
    <section className="py-14 bg-white" id="details_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Workshop Crash Parameters ⚡
          </h2>
          <p className="mt-2 text-base text-slate-500 font-semibold">
            Essential facts & variables of our online interactive AI system program.
          </p>
        </div>

        {/* Responsive Grid of Cards formatted like the top metrics bar of the Vibrant Palette */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {detailsData.map((detail) => (
            <div
              key={detail.id}
              id={`detail_card_${detail.id}`}
              className={`p-5 rounded-3xl border ${detail.colorTheme.border} ${detail.colorTheme.bg} text-center flex flex-col justify-between items-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md col-span-1`}
            >
              <div className="text-xs font-black uppercase tracking-wider mb-2 text-slate-400">
                {detail.label}
              </div>
              
              {/* Center Icon */}
              <div className={`mb-3 ${detail.colorTheme.accent}`}>
                {renderIcon(detail.iconName, "w-6 h-6 shrink-0 inline")}
              </div>

              <div className={`text-base sm:text-lg font-black ${detail.colorTheme.text}`}>
                {detail.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
