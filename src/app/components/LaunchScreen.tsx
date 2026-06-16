import React from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Sparkles, UserCircle, ArrowRight, ShieldAlert, Activity, FileText, ChevronRight } from "lucide-react";
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
          
          {/* Smart Dashboard (Anchor - Span 2x2) */}
          <button
            onClick={() => navigate("/dashboard")}
            className="col-span-2 row-span-2 group text-left rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 relative overflow-hidden flex flex-col justify-between"
            style={{ ...glassStyle, animationDelay: '100ms' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-gray-200">
                <LayoutDashboard className="w-8 h-8 text-gray-800" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">Smart<br />Dashboard</h2>
              <p className="text-base text-gray-500 leading-relaxed max-w-sm">
                Real-time command center for crisis monitoring, issue tracking, and comprehensive system health analysis.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-gray-800 transition-colors uppercase tracking-widest bg-white/50 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
              Launch Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
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

          {/* Active Alerts (Span 1x1 Supplementary) */}
          <div
            className="col-span-1 row-span-1 rounded-[2rem] p-6 shadow-lg animate-in fade-in zoom-in-95 flex flex-col justify-between relative overflow-hidden"
            style={{ ...glassStyle, animationDelay: '400ms' }}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 bg-gray-100/80 rounded-xl flex items-center justify-center border border-gray-200">
                <ShieldAlert className="w-5 h-5 text-gray-800" />
              </div>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-red-600 tracking-tighter">2</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Active Alerts</p>
            </div>
          </div>

          {/* System Health (Span 2x1 Supplementary) */}
          <div
            className="col-span-2 row-span-1 rounded-[2rem] p-6 shadow-lg animate-in fade-in zoom-in-95 flex items-center justify-between"
            style={{ ...glassStyle, animationDelay: '500ms' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-gray-800" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">System Health</span>
              </div>
              <h3 className="text-4xl font-black text-gray-900">99.9%</h3>
              <p className="text-xs text-emerald-600 font-bold mt-2 bg-emerald-50 w-fit px-2 py-1 rounded-md">ALL SYSTEMS OPERATIONAL</p>
            </div>
            <div className="h-full w-32 flex items-end gap-1 opacity-50">
               {/* Dummy bars for aesthetic */}
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="w-full bg-emerald-400 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Recent Reports (Span 2x1 Supplementary) */}
          <button
            onClick={() => navigate("/report")}
            className="col-span-2 row-span-1 group text-left rounded-[2rem] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 flex items-center gap-6"
            style={{ ...glassStyle, animationDelay: '600ms' }}
          >
            <div className="w-16 h-16 bg-gray-100/80 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200 group-hover:bg-gray-200 transition-colors">
              <FileText className="w-8 h-8 text-gray-800 transition-colors" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Recent Reports</h2>
              <p className="text-sm text-gray-500">Access and download generated intelligence briefs.</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
