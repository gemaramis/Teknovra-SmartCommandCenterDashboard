import React from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Sparkles, UserCircle, ShieldAlert, Activity, FileText, ChevronRight, ArrowUpRight, BarChart2 } from "lucide-react";

// One realistic ECG beat (P wave, QRS complex, T wave) per 150px
const ecgBeat = (x: number) =>
  `M${x},30 H${x + 25} q6,-8 12,0 H${x + 60} l4,6 l6,-34 l6,42 l4,-14 H${x + 105} q10,-12 20,0 H${x + 150}`;
const ECG_PATH = [0, 150, 300].map(ecgBeat).join(" ");

const NAV_CARDS = [
  {
    route: "/dashboard",
    icon: LayoutDashboard,
    title: "Executive Dashboard",
    desc: "High-level command center for crisis and system health.",
  },
  {
    route: "/operational",
    icon: BarChart2,
    title: "Operational Dashboard",
    desc: "Granular data analytics, keyword tracking, and live streams.",
  },
  {
    route: "/profile-builder",
    icon: UserCircle,
    title: "Profile Builder",
    desc: "Deep AI profiling and exposure scraping to verify targets.",
  },
  {
    route: "/generate-action",
    icon: Sparkles,
    title: "Generate Action",
    desc: "AI-drafted responses and countermeasures for active issues.",
  },
  {
    route: "/report",
    icon: FileText,
    title: "Recent Reports",
    desc: "Compile and distribute analysis documents in one click.",
  },
];

export function LaunchScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-[#F7F6FA]">
      <div className="w-full max-w-[1240px] px-8">
        {/* Header */}
        <div className="w-full flex justify-between items-end mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div>
            <h1 className="text-4xl font-semibold text-[#191233] tracking-tight leading-none mb-2.5">Workspace</h1>
            <p className="text-base text-[#6E6791]">Intelligence Suite &amp; Command Center</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#6E6791] bg-white border border-[#E7E4EF] hover:text-[#7B2FD6] hover:border-[#C9B2EE] transition-colors">
            Platform Settings <ChevronRight size={15} />
          </button>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-3 gap-5">
          {NAV_CARDS.map((card, i) => (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="group text-left bg-white border border-[#E7E4EF] rounded-2xl p-6 h-[210px] flex flex-col transition-all duration-200 hover:border-[#C9B2EE] hover:shadow-[0_8px_24px_-12px_rgba(123,47,214,0.25)] hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards"
              style={{ animationDelay: `${50 + i * 45}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-[#F3EEFB] rounded-xl flex items-center justify-center transition-colors duration-200 group-hover:bg-[#7B2FD6]">
                  <card.icon className="w-5 h-5 text-[#7B2FD6] transition-colors duration-200 group-hover:text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#D8D3E6] transition-all duration-200 group-hover:text-[#7B2FD6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="mt-auto">
                <h2 className="text-lg font-semibold text-[#191233] tracking-tight">{card.title}</h2>
                <p className="text-sm text-[#6E6791] mt-1.5 leading-relaxed">{card.desc}</p>
              </div>
            </button>
          ))}

          {/* System Status */}
          <div
            className="bg-white border border-[#E7E4EF] rounded-2xl p-6 h-[210px] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards"
            style={{ animationDelay: `${50 + NAV_CARDS.length * 45}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6E6791] uppercase tracking-wider">System Status</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#059669]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" /> Live
              </span>
            </div>

            <div className="flex items-center gap-6 mt-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FEF2F2] rounded-lg flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-[#191233] tracking-tight leading-none">2</div>
                  <div className="text-[0.65rem] font-medium text-[#9C96B5] uppercase tracking-wider mt-1">Active Alerts</div>
                </div>
              </div>

              <div className="w-px h-9 bg-[#E7E4EF]" />

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#059669]" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-[#059669] tracking-tight leading-none">Healthy</div>
                  <div className="text-[0.65rem] font-medium text-[#9C96B5] uppercase tracking-wider mt-1">Sentiment</div>
                </div>
              </div>
            </div>

            {/* ECG monitor trace: dim baseline + bright pulse sweeping the waveform */}
            <div className="mt-auto h-12 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 450 60" preserveAspectRatio="none">
                <path d={ECG_PATH} fill="none" stroke="#059669" strokeWidth="1.5" opacity="0.15" />
                <path
                  d={ECG_PATH}
                  pathLength={600}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ecg-sweep"
                  style={{ filter: "drop-shadow(0 0 3px rgba(5,150,105,0.55))" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
