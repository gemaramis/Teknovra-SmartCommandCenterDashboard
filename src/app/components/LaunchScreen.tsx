import React from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Sparkles, UserCircle, ShieldAlert, Activity, FileText, ChevronRight, BarChart2 } from "lucide-react";
import logoTeknovra from "../../imports/logo_teknovra.png";

const cardBase =
  "group text-left bg-white border border-[#E7E4EF] rounded-2xl transition-all duration-200 hover:border-[#C9B2EE] hover:shadow-[0_8px_24px_-12px_rgba(123,47,214,0.25)]";

export function LaunchScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F7F6FA]">
      <div className="w-full max-w-6xl px-8 flex flex-col h-full max-h-[860px] py-12">
        {/* Header Section */}
        <div className="w-full flex justify-between items-end mb-10">
          <div>
            <img src={logoTeknovra} alt="Teknovra Logo" className="h-8 object-contain mb-6" />
            <h1 className="text-4xl font-semibold text-[#191233] tracking-tight leading-none mb-2">Workspace</h1>
            <p className="text-base text-[#6E6791]">Intelligence Suite &amp; Command Center</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#6E6791] bg-white border border-[#E7E4EF] hover:text-[#7B2FD6] hover:border-[#C9B2EE] transition-colors">
            Platform Settings <ChevronRight size={15} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 grid-rows-3 gap-4 w-full flex-1 min-h-0">
          {/* Executive Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className={`${cardBase} col-span-2 row-span-1 p-6 flex items-center justify-between`}
          >
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-2xl font-semibold text-[#191233] tracking-tight mb-2">Executive Dashboard</h2>
              <p className="text-sm text-[#6E6791] max-w-[280px] leading-relaxed">High-level command center for crisis and system health.</p>
            </div>
            <div className="w-14 h-14 bg-[#F3EEFB] rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#7B2FD6]">
              <LayoutDashboard className="w-6 h-6 text-[#7B2FD6] transition-colors group-hover:text-white" />
            </div>
          </button>

          {/* Operational Dashboard */}
          <button
            onClick={() => navigate("/operational")}
            className={`${cardBase} col-span-2 row-span-1 p-6 flex items-center justify-between`}
          >
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-2xl font-semibold text-[#191233] tracking-tight mb-2">Operational Dashboard</h2>
              <p className="text-sm text-[#6E6791] max-w-[280px] leading-relaxed">Granular data analytics, keyword tracking, and live streams.</p>
            </div>
            <div className="w-14 h-14 bg-[#F3EEFB] rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#7B2FD6]">
              <BarChart2 className="w-6 h-6 text-[#7B2FD6] transition-colors group-hover:text-white" />
            </div>
          </button>

          {/* Profile Builder */}
          <button
            onClick={() => navigate("/profile-builder")}
            className={`${cardBase} col-span-2 row-span-1 p-6 flex items-center justify-between`}
          >
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-2xl font-semibold text-[#191233] tracking-tight mb-2">Profile Builder</h2>
              <p className="text-sm text-[#6E6791] max-w-[280px] leading-relaxed">Deep AI profiling and exposure scraping to verify targets.</p>
            </div>
            <div className="w-14 h-14 bg-[#F3EEFB] rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#7B2FD6]">
              <UserCircle className="w-6 h-6 text-[#7B2FD6] transition-colors group-hover:text-white" />
            </div>
          </button>

          {/* Generate Action */}
          <button
            onClick={() => navigate("/generate-action")}
            className={`${cardBase} col-span-1 row-span-1 p-6 flex flex-col justify-between`}
          >
            <div className="w-11 h-11 bg-[#F3EEFB] rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#7B2FD6]">
              <Sparkles className="w-5 h-5 text-[#7B2FD6] transition-colors group-hover:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[#191233] tracking-tight leading-snug">Generate<br />Action</h2>
          </button>

          {/* Recent Reports */}
          <button
            onClick={() => navigate("/report")}
            className={`${cardBase} col-span-1 row-span-1 p-6 flex flex-col justify-between`}
          >
            <div className="w-11 h-11 bg-[#F3EEFB] rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#7B2FD6]">
              <FileText className="w-5 h-5 text-[#7B2FD6] transition-colors group-hover:text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[#191233] tracking-tight leading-snug">Recent<br />Reports</h2>
          </button>

          {/* Unified Status Bar */}
          <div className="col-span-4 row-span-1 bg-white border border-[#E7E4EF] rounded-2xl px-8 py-6 flex items-center justify-between">
            {/* Active Alerts */}
            <div className="flex items-center gap-5">
              <div className="relative w-11 h-11 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#DC2626] border-2 border-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#191233] tracking-tight leading-none">2</h3>
                <p className="text-xs font-medium text-[#6E6791] uppercase tracking-wider mt-1">Active Alerts</p>
              </div>
            </div>

            <div className="w-px h-12 bg-[#E7E4EF]" />

            {/* Sentiment Status / Heartbeat */}
            <div className="flex items-center gap-6 flex-1 ml-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-[#6E6791]" />
                  <span className="text-xs font-medium text-[#6E6791] uppercase tracking-wider">Sentiment Status</span>
                </div>
                <h3 className="text-xl font-semibold text-[#059669] tracking-tight">Healthy</h3>
              </div>

              {/* Heartbeat line */}
              <div className="flex-1 h-10 relative flex items-center ml-8 opacity-60 overflow-hidden">
                <svg width="200%" height="100%" viewBox="0 0 1000 50" preserveAspectRatio="none" className="heartbeat-line">
                  <polyline
                    points="0,25 50,25 60,10 70,40 80,25 150,25 160,15 170,35 180,25 250,25 260,5 270,45 280,25 350,25 360,10 370,40 380,25 450,25 460,15 470,35 480,25 500,25 550,25 560,10 570,40 580,25 650,25 660,15 670,35 680,25 750,25 760,5 770,45 780,25 850,25 860,10 870,40 880,25 950,25 960,15 970,35 980,25 1000,25"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
