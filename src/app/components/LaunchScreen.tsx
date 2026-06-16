import React from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, Sparkles, UserCircle, ArrowRight } from "lucide-react";
import logoTeknovra from "../../imports/logo_teknovra.png";

export function LaunchScreen() {
  const navigate = useNavigate();

  const modules = [
    {
      id: "dashboard",
      title: "Smart Dashboard",
      description: "Real-time command center for crisis monitoring, issue tracking, and system health.",
      icon: LayoutDashboard,
      path: "/dashboard",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: "generate",
      title: "Generate Action",
      description: "AI-powered engine to generate hyper-contextual responses and countermeasures for critical issues.",
      icon: Sparkles,
      path: "/generate-action",
      color: "from-purple-500 to-pink-600",
      bg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: "profile",
      title: "Profile Builder",
      description: "Deep AI profiling and exposure scraping to verify targets and synthesize historical data.",
      icon: UserCircle,
      path: "/profile-builder",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden relative" style={{ background: "linear-gradient(135deg, #E6E0F8 0%, #F5E3F0 50%, #E2EDF8 100%)" }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center">
        {/* Logo Header */}
        <div className="mb-16 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-4 rounded-2xl shadow-xl shadow-purple-900/5 mb-6 border border-white/50" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <img src={logoTeknovra} alt="Teknovra Logo" className="h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-2">Intelligence Suite</h1>
          <p className="text-gray-500 font-medium">Select a module to initiate your session</p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {modules.map((mod, i) => (
            <button
              key={mod.id}
              onClick={() => navigate(mod.path)}
              className="group text-left rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${(i + 1) * 150}ms`, background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
              <div className={`w-14 h-14 ${mod.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <mod.icon className={`w-7 h-7 ${mod.iconColor}`} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{mod.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 h-16">
                {mod.description}
              </p>
              <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest">
                Launch Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
