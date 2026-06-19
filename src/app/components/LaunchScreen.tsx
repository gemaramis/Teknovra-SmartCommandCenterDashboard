import React from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Sparkles, UserCircle, ArrowRight, ShieldAlert, Activity, FileText, ChevronRight, BarChart2 } from "lucide-react";
import logoTeknovra from "../../imports/logo_teknovra.png";

export function LaunchScreen() {
  const navigate = useNavigate();

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative" style={{ background: "linear-gradient(135deg, #E6E0F8 0%, #F5E3F0 50%, #E2EDF8 100%)" }}>
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col items-center h-full max-h-[900px] py-12">
        {/* Header Section */}
        <div className="w-full flex justify-between items-end mb-8 animate-in fade-in slide-in-from-top-8 duration-700">
          <div>
            <div className="p-3 rounded-2xl shadow-xl shadow-purple-900/5 mb-6 inline-block" style={glassStyle}>
              <img src={logoTeknovra} alt="Teknovra Logo" className="h-10 object-contain" />
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-none mb-2">Workspace</h1>
            <p className="text-lg text-gray-500 font-medium">Intelligence Suite & Command Center</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:text-purple-700 hover:scale-105 transition-all shadow-sm" style={glassStyle}>
            Platform Settings <ChevronRight size={16} />
          </button>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-4 grid-rows-3 gap-6 w-full flex-1 min-h-0">
          
          {/* Executive Dashboard (Span 2x1) */}
          <button
            onClick={() => navigate("/dashboard")}
            className="col-span-2 row-span-1 group text-left rounded-[2rem] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 relative overflow-hidden flex items-center justify-between"
            style={{ ...glassStyle, animationDelay: '100ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-center">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Executive<br />Dashboard</h2>
              <p className="text-sm text-gray-500 max-w-[250px]">High-level command center for crisis and system health.</p>
            </div>
            <div className="relative z-10 w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner border border-gray-200 shrink-0">
              <LayoutDashboard className="w-10 h-10 text-gray-800" />
            </div>
          </button>

          {/* Operational Dashboard (Span 2x1) */}
          <button
            onClick={() => navigate("/operational")}
            className="col-span-2 row-span-1 group text-left rounded-[2rem] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 relative overflow-hidden flex items-center justify-between"
            style={{ ...glassStyle, animationDelay: '150ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-center">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Operational<br />Dashboard</h2>
              <p className="text-sm text-gray-500 max-w-[250px]">Granular data analytics, keyword tracking, and live streams.</p>
            </div>
            <div className="relative z-10 w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner border border-gray-200 shrink-0">
              <BarChart2 className="w-10 h-10 text-gray-800" />
            </div>
          </button>

          {/* Profile Builder (Span 2x1) */}
          <button
            onClick={() => navigate("/profile-builder")}
            className="col-span-2 row-span-1 group text-left rounded-[2rem] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 relative overflow-hidden flex items-center justify-between"
            style={{ ...glassStyle, animationDelay: '200ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-center">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Profile Builder</h2>
              <p className="text-sm text-gray-500 max-w-[250px]">Deep AI profiling and exposure scraping to verify targets.</p>
            </div>
            <div className="relative z-10 w-20 h-20 bg-gray-100/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner border border-gray-200 shrink-0">
              <UserCircle className="w-10 h-10 text-gray-800" />
            </div>
          </button>

          {/* Generate Action (Span 1x1) */}
          <button
            onClick={() => navigate("/generate-action")}
            className="col-span-1 row-span-1 group text-left rounded-[2rem] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col justify-between relative overflow-hidden"
            style={{ ...glassStyle, animationDelay: '300ms' }}
          >
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative z-10 w-12 h-12 bg-gray-100/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner border border-gray-200">
              <Sparkles className="w-6 h-6 text-gray-800" />
            </div>
            <h2 className="relative z-10 text-2xl font-black text-gray-900 leading-tight">Generate<br/>Action</h2>
          </button>

          {/* Recent Reports (Span 1x1 Supplementary) */}
          <button
            onClick={() => navigate("/report")}
            className="col-span-1 row-span-1 group text-left rounded-[2rem] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col justify-between relative overflow-hidden"
            style={{ ...glassStyle, animationDelay: '400ms' }}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-400/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative z-10 w-12 h-12 bg-gray-100/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner border border-gray-200">
              <FileText className="w-6 h-6 text-gray-800" />
            </div>
            <h2 className="relative z-10 text-2xl font-black text-gray-900 leading-tight">Recent<br/>Reports</h2>
          </button>

          {/* Unified Status Bar (Span 4x1) */}
          <div
            className="col-span-4 row-span-1 rounded-[2rem] px-8 py-6 flex items-center justify-between animate-in fade-in zoom-in-95 shadow-inner"
            style={{ 
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)", 
              WebkitBackdropFilter: "blur(12px)", 
              border: "1px solid rgba(255, 255, 255, 0.4)",
              animationDelay: '500ms'
            }}
          >
            {/* Active Alerts */}
            <div className="flex items-center gap-6">
              <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-12 bg-gray-100/50 rounded-xl flex items-center justify-center border border-gray-200">
                  <ShieldAlert className="w-6 h-6 text-gray-800" />
                </div>
                <span className="flex h-3 w-3 relative -ml-3 -mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-red-600 tracking-tighter leading-none">2</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Active Alerts</p>
              </div>
            </div>

            <div className="w-px h-12 bg-white/30" />

            {/* Sentiment Status / Heartbeat */}
            <div className="flex items-center gap-6 flex-1 ml-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-gray-800" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sentiment Status</span>
                </div>
                <h3 className="text-2xl font-black text-emerald-600">Healthy</h3>
              </div>
              
              {/* Heartbeat SVG Animation */}
              <div className="flex-1 h-12 relative flex items-center ml-8 opacity-80 overflow-hidden">
                <svg width="200%" height="100%" viewBox="0 0 1000 50" preserveAspectRatio="none" className="heartbeat-line drop-shadow-md">
                  <polyline 
                    points="0,25 50,25 60,10 70,40 80,25 150,25 160,15 170,35 180,25 250,25 260,5 270,45 280,25 350,25 360,10 370,40 380,25 450,25 460,15 470,35 480,25 500,25 550,25 560,10 570,40 580,25 650,25 660,15 670,35 680,25 750,25 760,5 770,45 780,25 850,25 860,10 870,40 880,25 950,25 960,15 970,35 980,25 1000,25"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
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
