import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, BarChart2, TrendingUp, MessageSquare, Users, 
  Map, PieChart, Info, Filter, Download, Plus, Search, ChevronDown, Check
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const SIDEBAR_TABS = [
  { id: "summary", label: "Summary", icon: BarChart2 },
  { id: "trendings", label: "Trendings", icon: TrendingUp },
  { id: "mentions", label: "Mentions", icon: MessageSquare },
  { id: "authors", label: "Authors", icon: Users },
  { id: "analysis", label: "Geo Analysis", icon: Map },
];

export function OperationalDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
  };

  const activeGlassStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(123, 47, 214, 0.3)",
    boxShadow: "0 4px 12px rgba(123, 47, 214, 0.1)"
  };

  const renderSummaryTab = () => (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Top KPIs */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: "Total Mentions", value: "14,291", color: "bg-emerald-500" },
          { label: "Total Engagement", value: "482.1k", color: "bg-emerald-600" },
          { label: "Unique Authors", value: "8,401", color: "bg-emerald-700" },
          { label: "Positive Mentions", value: "4,120", color: "bg-green-500" },
          { label: "Negative Mentions", value: "2,094", color: "bg-red-500" },
          { label: "Neutral Mentions", value: "8,077", color: "bg-blue-500" },
        ].map((kpi, idx) => (
          <div key={idx} className={`${kpi.color} text-white rounded-2xl p-4 shadow-lg relative overflow-hidden group`}>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{kpi.label}</h3>
            <div className="text-2xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="col-span-2 rounded-2xl p-6" style={glassStyle}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} /> Timeline of Mentions
            </h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold bg-white/50 px-3 py-1 rounded text-purple-700">HOURLY</button>
              <button className="text-xs font-bold px-3 py-1 rounded text-gray-500 hover:bg-white/50">DAILY</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { time: '10:00', value: 120 }, { time: '11:00', value: 300 }, { time: '12:00', value: 250 },
                { time: '13:00', value: 800 }, { time: '14:00', value: 650 }, { time: '15:00', value: 920 },
              ]}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={glassStyle} />
                <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source of Mentions */}
        <div className="col-span-1 rounded-2xl p-6 flex flex-col" style={glassStyle}>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-6">
            <PieChart size={16} /> Source Breakdown
          </h3>
          <div className="flex-1 flex flex-col gap-4">
            {[
              { name: "X (Twitter)", val: "45%", count: "6,430" },
              { name: "News Portals", val: "25%", count: "3,572" },
              { name: "Instagram", val: "15%", count: "2,143" },
              { name: "TikTok", val: "10%", count: "1,429" },
              { name: "Facebook", val: "5%", count: "717" },
            ].map((src, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm font-bold text-gray-700">{src.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{src.count}</span>
                  <div className="w-20 h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: src.val }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentionsTab = () => (
    <div className="flex flex-col gap-4 h-full animate-in fade-in">
      {/* Channel Filters */}
      <div className="flex gap-2 w-full overflow-x-auto pb-2">
        {[
          { name: "All", color: "bg-gray-700" },
          { name: "Facebook", color: "bg-blue-600" },
          { name: "X (Twitter)", color: "bg-sky-500" },
          { name: "News", color: "bg-green-600" },
          { name: "Blogs/Forums", color: "bg-orange-500" },
          { name: "Youtube", color: "bg-red-600" },
          { name: "Instagram", color: "bg-fuchsia-600" },
          { name: "Tiktok", color: "bg-black" },
        ].map((c, i) => (
          <button key={i} className={`${c.color} text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md flex flex-col items-center min-w-[100px] hover:scale-105 transition-transform`}>
            <span>{c.name}</span>
            <span className="text-xs font-normal opacity-80 mt-1">{i===0 ? "14.2k" : Math.floor(Math.random()*3000)}</span>
          </button>
        ))}
      </div>
      
      <div className="flex flex-1 min-h-0 gap-6 mt-4">
        {/* Main Stream */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          {[1,2,3,4,5].map((item) => (
            <div key={item} className="p-5 rounded-2xl flex flex-col gap-3" style={glassStyle}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <div className="font-bold text-gray-900">@tech_analyst_{item}</div>
                    <div className="text-xs text-gray-500">2 mins ago • X (Twitter)</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-bold uppercase">Negative</span>
              </div>
              <p className="text-gray-700 text-sm">
                The recent changes to the #Indosat network have caused massive latency spikes in the eastern region. Completely unacceptable for enterprise users. We are migrating our servers.
              </p>
              <div className="flex gap-4 text-xs font-bold text-gray-400 mt-2">
                <span>🔄 142 Reposts</span>
                <span>❤️ 890 Likes</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Filter Sidebar */}
        <div className="w-[300px] flex flex-col gap-4">
          <div className="p-4 rounded-2xl" style={glassStyle}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter size={14} /> Advanced Filters
            </h3>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Filter by text..." className="w-full bg-white/50 border border-white/60 rounded-xl p-2.5 text-sm outline-none focus:bg-white" />
              <input type="text" placeholder="Filter by author..." className="w-full bg-white/50 border border-white/60 rounded-xl p-2.5 text-sm outline-none focus:bg-white" />
              <input type="text" placeholder="Filter by location..." className="w-full bg-white/50 border border-white/60 rounded-xl p-2.5 text-sm outline-none focus:bg-white" />
              <button className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl mt-2 shadow-md">Apply Filters</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrendingsTab = () => (
    <div className="animate-in fade-in h-full flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800">X (Twitter) Indonesia Trendings</h2>
      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {[
          { title: "Latest", items: ["#NetworkDown", "Indosat", "Latency", "Enterprise", "#FixItNow"] },
          { title: "10-25 Minutes Ago", items: ["#NetworkDown", "Indosat", "Jumat", "Korsel", "Enterprise"] },
          { title: "An Hour Ago", items: ["#SelamatPagi", "Indosat", "Jumat", "Sarapan", "Weekend"] }
        ].map((col, idx) => (
          <div key={idx} className="rounded-2xl p-6 flex flex-col gap-4" style={glassStyle}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200/50 pb-2">{col.title}</h3>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {col.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="font-bold text-gray-700 group-hover:text-purple-600 transition-colors cursor-pointer">{item}</span>
                  <span className="text-xs font-medium text-gray-400 bg-white/50 px-2 py-0.5 rounded">{Math.floor(Math.random() * 5000)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGeoTab = () => (
    <div className="animate-in fade-in h-full flex flex-col gap-6">
      <div className="flex-1 rounded-2xl p-6 flex flex-col items-center justify-center relative" style={glassStyle}>
        <h3 className="absolute top-6 left-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Buzz Geo Distribution</h3>
        <Map className="w-64 h-64 text-emerald-600 opacity-20" />
        <p className="text-emerald-700 font-bold mt-4">Geospatial Mapping Engine Online</p>
        <p className="text-sm text-gray-500">Live heatmap overlay active for Indonesia Region.</p>
      </div>
      <div className="h-1/3 rounded-2xl p-6" style={glassStyle}>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Top Provinces by Mention</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center border-b border-white pb-2">
            <span className="font-bold text-gray-700">DKI Jakarta</span>
            <span className="text-sm font-bold text-emerald-600">4,201 Mentions</span>
          </div>
          <div className="flex justify-between items-center border-b border-white pb-2">
            <span className="font-bold text-gray-700">Jawa Barat</span>
            <span className="text-sm font-bold text-emerald-600">3,190 Mentions</span>
          </div>
          <div className="flex justify-between items-center border-b border-white pb-2">
            <span className="font-bold text-gray-700">Jawa Timur</span>
            <span className="text-sm font-bold text-emerald-600">2,845 Mentions</span>
          </div>
          <div className="flex justify-between items-center border-b border-white pb-2">
            <span className="font-bold text-gray-700">Banten</span>
            <span className="text-sm font-bold text-emerald-600">1,420 Mentions</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex text-[#1A1230]" style={{ background: "linear-gradient(135deg, #E6E0F8 0%, #F5E3F0 50%, #E2EDF8 100%)" }}>
      
      {/* Left Sidebar Architecture */}
      <div className="w-[280px] flex flex-col h-full border-r border-white/40" style={{ background: "rgba(255, 255, 255, 0.3)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
        
        {/* Logo Area */}
        <div className="p-6 border-b border-white/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-purple-500 flex items-center justify-center shadow-lg">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-800">Operational</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Data Modules</div>
          {SIDEBAR_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                style={isActive ? activeGlassStyle : {}}
              >
                <tab.icon size={18} className={isActive ? "text-purple-600" : "text-gray-500"} />
                <span className={`font-bold ${isActive ? "text-purple-800" : "text-gray-600"}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Exit Button */}
        <div className="p-4 border-t border-white/30">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-white/50 transition-colors"
          >
            <ArrowLeft size={16} /> Exit to Hub
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 border-b border-white/40 flex items-center justify-between px-8" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white/70 hover:bg-white px-4 py-2 rounded-lg font-bold text-sm text-purple-700 shadow-sm transition-colors border border-white/80">
              <Plus size={16} /> Indosat General
            </button>
            <div className="text-gray-400">/</div>
            <span className="font-bold text-gray-600 uppercase tracking-widest text-sm">
              {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 border border-white/50">
              June 16, 2026 - June 19, 2026 <ChevronDown size={14} />
            </div>
            <div className="w-px h-8 bg-white/40" />
            <button className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border-2 border-white shadow-sm">
              IA
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {activeTab === "summary" && renderSummaryTab()}
          {activeTab === "mentions" && renderMentionsTab()}
          {activeTab === "trendings" && renderTrendingsTab()}
          {activeTab === "analysis" && renderGeoTab()}
          {activeTab === "authors" && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-in fade-in">
              <Users size={64} className="opacity-20 mb-4" />
              <p className="font-bold text-xl">Author Demographics Module Ready for API Hookup</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
