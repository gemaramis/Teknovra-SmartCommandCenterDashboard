import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, BarChart2, TrendingUp, MessageSquare, Users, 
  Map, PieChart, Info, Filter, Download, Plus, Search, ChevronDown, Check,
  Calendar as CalendarIcon, Settings, LogOut, Search as SearchIcon
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";

const SIDEBAR_TABS = [
  { id: "summary", label: "Summary", icon: BarChart2 },
  { id: "mentions", label: "Mentions", icon: MessageSquare },
  { id: "authors", label: "Authors", icon: Users },
  { id: "analysis", label: "Geo Analysis", icon: Map },
];

export function OperationalDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  
  const [isTrackerDropdownOpen, setTrackerDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [engineStatus, setEngineStatus] = useState({ isScraping: false, lastRun: null, recordsProcessed: 0 });
  const [mentionsData, setMentionsData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 5, 16),
    to: new Date(2026, 5, 19)
  });

  const getDisplayDate = () => {
    if (dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
      }
      return format(dateRange.from, "MMM d, yyyy");
    }
    return "Select Range";
  };
  const [availableProjects, setAvailableProjects] = useState(["All Projects"]);
  const [activeProject, setActiveProject] = useState("All Projects");
  const [dashboardStats, setDashboardStats] = useState({
    kpis: { totalMentions: 0, positive: 0, negative: 0, neutral: 0 },
    topIssues: [],
    sources: []
  });

  React.useEffect(() => {
    // Poll the engine status every 5 seconds
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setEngineStatus(data);
        }
        
        const mentionsRes = await fetch(`/api/mentions?entity=${encodeURIComponent(activeProject)}`);
        if (mentionsRes.ok) {
          const mData = await mentionsRes.json();
          setMentionsData(mData.data || []);
        }

        const statsRes = await fetch(`/api/dashboard/stats?entity=${encodeURIComponent(activeProject)}`);
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setDashboardStats(sData);
        }
      } catch (err) {
        // Silently fail if engine is not running yet
      }
    };
    
    // Fetch available projects from settings on load
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.target_entities) {
        setAvailableProjects(["All Projects", ...d.target_entities]);
      }
    }).catch(() => {});

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [activeProject]);

  const glassStyle = {
    background: "#FFFFFF",
    border: "1px solid #E7E4EF",
  };

  const activeGlassStyle = {
    background: "#F3EEFB",
    border: "1px solid transparent",
  };

  const renderSummaryTab = () => (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Total Mentions", value: dashboardStats.kpis.totalMentions, trend: "+12.5%", color: "text-purple-600" },
          { label: "Positive Sentiment", value: dashboardStats.kpis.positive, trend: "+4.2%", color: "text-emerald-500" },
          { label: "Negative Sentiment", value: dashboardStats.kpis.negative, trend: "-2.1%", color: "text-red-500" },
          { label: "Neutral Sentiment", value: dashboardStats.kpis.neutral, trend: "+8.4%", color: "text-sky-500" }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-[#E7E4EF] rounded-xl p-4 relative overflow-hidden group hover:border-[#C9B2EE] transition-colors">
            <h3 className="text-xs font-medium uppercase tracking-wider text-[#6E6791] mb-2">{kpi.label}</h3>
            <div className={`text-2xl font-semibold tracking-tight ${kpi.color}`}>{kpi.value}</div>
            <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
              {kpi.trend.startsWith('+') ? <TrendingUp size={12}/> : <TrendingUp size={12} className="rotate-180"/>} {kpi.trend} vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="col-span-2 rounded-xl p-6" style={glassStyle}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-medium text-[#6E6791] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={14} /> Timeline of Mentions
            </h3>
            <div className="flex rounded-lg bg-[#F1EFF6] p-0.5">
              <button className="text-xs font-semibold bg-white px-3 py-1 rounded-md text-[#7B2FD6] shadow-sm">HOURLY</button>
              <button className="text-xs font-semibold px-3 py-1 rounded-md text-[#6E6791] hover:text-[#191233]">DAILY</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { time: '10:00', value: 120 }, { time: '11:00', value: 300 }, { time: '12:00', value: 250 },
                { time: '13:00', value: 800 }, { time: '14:00', value: 650 }, { time: '15:00', value: dashboardStats.kpis.totalMentions },
              ]}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2FD6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7B2FD6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E7E4EF", borderRadius: "8px", boxShadow: "0 4px 12px rgba(23,15,46,0.08)" }} />
                <Area type="monotone" dataKey="value" stroke="#7B2FD6" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source of Mentions */}
        <div className="col-span-1 rounded-xl p-6 flex flex-col" style={glassStyle}>
          <h3 className="text-xs font-medium text-[#6E6791] uppercase tracking-wider flex items-center gap-2 mb-6">
            <PieChart size={14} /> Source Breakdown
          </h3>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {dashboardStats.sources.length === 0 && <div className="text-[#9C96B5] font-medium text-sm">No data available</div>}
            {dashboardStats.sources.map((src: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#191233]">{src.name}</span>
                  <span className="text-[#7B2FD6] font-semibold">{src.val}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9C96B5]">{src.count} mentions</span>
                  <div className="flex-1 h-1 bg-[#F1EFF6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7B2FD6]" style={{ width: src.val }} />
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
          { name: "All", color: "#7B2FD6" },
          { name: "Facebook", color: "#1877F2" },
          { name: "X (Twitter)", color: "#0EA5E9" },
          { name: "News", color: "#059669" },
          { name: "Blogs/Forums", color: "#EA580C" },
          { name: "Youtube", color: "#DC2626" },
          { name: "Instagram", color: "#C026D3" },
          { name: "Tiktok", color: "#191233" },
        ].map((c, i) => {
          let count = 0;
          if (c.name === "All") count = dashboardStats.kpis.totalMentions;
          else {
            const found = (dashboardStats.sources as any[]).find((s: any) => s.name.toLowerCase().includes(c.name.toLowerCase()));
            count = found ? found.count : 0;
          }
          const isZero = count === 0;

          return (
            <button
              key={i}
              disabled={isZero}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm min-w-fit whitespace-nowrap transition-colors ${
                isZero
                  ? 'bg-[#F7F6FA] border-[#E7E4EF] text-[#9C96B5]'
                  : 'bg-white border-[#E7E4EF] text-[#191233] hover:border-[#C9B2EE] cursor-pointer'
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: isZero ? "#D8D3E6" : c.color }} />
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-[#9C96B5]">{count.toLocaleString()}</span>
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-1 min-h-0 gap-6 mt-4">
        {/* Main Stream */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          {mentionsData.length === 0 && (
            <div className="p-8 rounded-xl text-center text-[#6E6791] font-medium" style={glassStyle}>
              No data collected yet. Wait for the engine to finish its crawl...
            </div>
          )}
          {mentionsData.map((item, idx) => (
            <div key={item.id || idx} className="p-5 rounded-xl flex flex-col gap-3 transition-colors hover:border-[#C9B2EE]" style={glassStyle}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F3EEFB] flex items-center justify-center font-semibold text-[#7B2FD6]">N</div>
                  <div>
                    <a href={item.link} target="_blank" rel="noreferrer" className="font-semibold text-[#191233] hover:text-[#7B2FD6] transition-colors line-clamp-1">{item.title}</a>
                    <div className="text-xs text-[#9C96B5]">{new Date(item.pubDate).toLocaleString()} • {item.source}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                  item.sentiment === 'POSITIVE' ? 'bg-emerald-50 text-emerald-700' :
                  item.sentiment === 'NEGATIVE' ? 'bg-red-50 text-red-700' :
                  'bg-[#F1EFF6] text-[#6E6791]'
                }`}>
                  {item.sentiment}
                </span>
              </div>
              <p className="text-[#443C66] text-sm">
                Entities detected: {item.entities && item.entities.length > 0 ? item.entities.join(", ") : "None"}
              </p>
            </div>
          ))}
        </div>

        {/* Right Filter Sidebar */}
        <div className="w-[300px] flex flex-col gap-4">
          <div className="p-4 rounded-xl" style={glassStyle}>
            <h3 className="text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter size={14} /> Advanced Filters
            </h3>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Filter by text..." className="w-full bg-white border border-[#E7E4EF] rounded-lg p-2.5 text-sm outline-none focus:border-[#7B2FD6] transition-colors placeholder-[#9C96B5]" />
              <input type="text" placeholder="Filter by author..." className="w-full bg-white border border-[#E7E4EF] rounded-lg p-2.5 text-sm outline-none focus:border-[#7B2FD6] transition-colors placeholder-[#9C96B5]" />
              <input type="text" placeholder="Filter by location..." className="w-full bg-white border border-[#E7E4EF] rounded-lg p-2.5 text-sm outline-none focus:border-[#7B2FD6] transition-colors placeholder-[#9C96B5]" />
              <button className="w-full py-2.5 bg-[#7B2FD6] hover:bg-[#6A28BC] text-white font-semibold rounded-lg mt-2 transition-colors">Apply Filters</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Trendings tab removed

  const renderGeoTab = () => (
    <div className="animate-in fade-in h-full flex flex-col gap-6">
      <div className="flex-1 rounded-xl p-6 flex flex-col items-center justify-center relative" style={glassStyle}>
        <h3 className="absolute top-6 left-6 text-xs font-medium text-[#6E6791] uppercase tracking-wider">Buzz Geo Distribution</h3>
        <Map className="w-64 h-64 text-[#7B2FD6] opacity-10" />
        <p className="text-[#7B2FD6] font-semibold mt-4">Geospatial Mapping Engine Online</p>
        <p className="text-sm text-[#6E6791]">Live heatmap overlay active for Indonesia Region.</p>
      </div>
      <div className="h-1/3 rounded-xl p-6" style={glassStyle}>
        <h3 className="text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-4">Top Provinces by Mention</h3>
        <div className="flex flex-col items-center justify-center h-32 text-[#9C96B5]">
          <p className="font-medium">Awaiting geospatial extraction module</p>
          <p className="text-sm">Location data will appear here once identified in news articles.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex text-[#191233] bg-[#F7F6FA]">

      {/* Left Sidebar Architecture */}
      <div className="w-[260px] flex flex-col h-full border-r border-[#E7E4EF] bg-white">

        {/* Logo Area */}
        <div className="p-6 border-b border-[#E7E4EF] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7B2FD6] flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-[#191233]">Operational</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-4">
          <div className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-2 px-2">Data Modules</div>
          {SIDEBAR_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isActive ? "bg-[#F3EEFB]" : "hover:bg-[#F7F6FA]"
                }`}
              >
                <tab.icon size={17} className={isActive ? "text-[#7B2FD6]" : "text-[#9C96B5]"} />
                <span className={`text-sm font-medium ${isActive ? "text-[#7B2FD6]" : "text-[#6E6791]"}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Exit Button */}
        <div className="p-4 border-t border-[#E7E4EF]">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#6E6791] hover:bg-[#F7F6FA] hover:text-[#191233] transition-colors"
          >
            <ArrowLeft size={15} /> Exit to Hub
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Navbar */}
        <header className="relative z-50 h-16 border-b border-[#E7E4EF] bg-white flex items-center justify-between px-8">

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => { setTrackerDropdownOpen(!isTrackerDropdownOpen); setDateDropdownOpen(false); setProfileDropdownOpen(false); }}
                className="flex items-center gap-2 bg-white hover:border-[#C9B2EE] px-4 py-2 rounded-lg font-medium text-sm text-[#7B2FD6] transition-colors border border-[#E7E4EF]"
              >
                <Plus size={15} /> {activeProject}
              </button>
              
              {isTrackerDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E7E4EF] rounded-xl shadow-[0_12px_32px_rgba(23,15,46,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-[#E7E4EF]">
                    <div className="flex items-center bg-[#F7F6FA] rounded-lg px-3 py-2">
                      <SearchIcon size={14} className="text-[#9C96B5] mr-2" />
                      <input type="text" placeholder="Search projects..." className="bg-transparent text-sm w-full outline-none placeholder-[#9C96B5]" />
                    </div>
                  </div>
                  <div className="py-2 max-h-48 overflow-y-auto">
                    {availableProjects.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setActiveProject(p); setTrackerDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                          activeProject === p ? 'text-[#7B2FD6] bg-[#F3EEFB] font-semibold' : 'text-[#6E6791] font-medium hover:bg-[#F7F6FA]'
                        }`}
                      >
                        {p} {activeProject === p && <Check size={14} className="text-[#7B2FD6]" />}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[#E7E4EF]">
                    <button onClick={() => navigate("/engine")} className="w-full py-2 bg-[#F3EEFB] hover:bg-[#EBE2F8] rounded-lg text-sm font-semibold text-[#7B2FD6] transition-colors flex justify-center items-center gap-2">
                      <Plus size={14} /> Configure Entities
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[#D8D3E6]">/</div>
            <span className="font-medium text-[#6E6791] uppercase tracking-wider text-xs">
              {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-4">

            {/* Engine Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F6FA] border border-[#E7E4EF] mr-2" title={engineStatus.isScraping ? "Engine is currently scraping data..." : `Idle. Last run: ${engineStatus.lastRun ? new Date(engineStatus.lastRun).toLocaleTimeString() : 'Never'}`}>
              <span className={`inline-flex rounded-full h-2 w-2 ${engineStatus.isScraping ? 'bg-[#7B2FD6]' : 'bg-[#C9C4D9]'}`}></span>
              <span className="text-[0.65rem] font-medium text-[#6E6791] uppercase tracking-wider">
                {engineStatus.isScraping ? 'Scraping...' : 'Idle'}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => { setDateDropdownOpen(!isDateDropdownOpen); setShowCustomCalendar(false); setTrackerDropdownOpen(false); setProfileDropdownOpen(false); }}
                className="flex items-center gap-2 bg-white hover:border-[#C9B2EE] px-4 py-2 rounded-lg text-sm font-medium text-[#6E6791] border border-[#E7E4EF] transition-colors cursor-pointer"
              >
                {getDisplayDate()} <ChevronDown size={14} />
              </button>
              
              {isDateDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-auto min-w-[224px] bg-white border border-[#E7E4EF] rounded-xl shadow-[0_12px_32px_rgba(23,15,46,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {!showCustomCalendar ? (
                    <>
                      <div className="py-2">
                        <button onClick={() => { setDateRange({ from: new Date(), to: new Date() }); setDateDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium text-[#6E6791] hover:bg-[#F7F6FA] transition-colors flex items-center gap-3">
                          <CalendarIcon size={14} className="text-[#9C96B5]" /> Today
                        </button>
                        <button onClick={() => { setDateRange({ from: subDays(new Date(), 7), to: new Date() }); setDateDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium text-[#6E6791] hover:bg-[#F7F6FA] transition-colors flex items-center gap-3">
                          <CalendarIcon size={14} className="text-[#9C96B5]" /> Last 7 Days
                        </button>
                        <button onClick={() => { setDateRange({ from: subDays(new Date(), 30), to: new Date() }); setDateDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium text-[#6E6791] hover:bg-[#F7F6FA] transition-colors flex items-center gap-3">
                          <CalendarIcon size={14} className="text-[#9C96B5]" /> Last 30 Days
                        </button>
                      </div>
                      <div className="p-3 border-t border-[#E7E4EF]">
                        <button onClick={() => setShowCustomCalendar(true)} className="w-full py-2 bg-[#F3EEFB] hover:bg-[#EBE2F8] rounded-lg text-sm font-semibold text-[#7B2FD6] transition-colors">
                          Custom Range...
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2 px-2">
                         <span className="text-xs font-medium text-[#6E6791] uppercase">Select Range</span>
                         <button onClick={() => setShowCustomCalendar(false)} className="text-xs text-[#7B2FD6] font-semibold">Back</button>
                      </div>
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range, selectedDay) => {
                          if (dateRange?.from && dateRange?.to) {
                            setDateRange({ from: selectedDay });
                          } else {
                            setDateRange(range);
                            if (range?.from && range?.to) {
                              setTimeout(() => setDateDropdownOpen(false), 300);
                            }
                          }
                        }}
                        numberOfMonths={2}
                        className="rounded-md"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-[#E7E4EF]" />

            <div className="relative">
              <button
                onClick={() => { setProfileDropdownOpen(!isProfileDropdownOpen); setTrackerDropdownOpen(false); setDateDropdownOpen(false); }}
                className="w-9 h-9 rounded-full bg-[#F3EEFB] flex items-center justify-center text-[#7B2FD6] text-sm font-semibold hover:bg-[#EBE2F8] transition-colors cursor-pointer"
              >
                IA
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#E7E4EF] rounded-xl shadow-[0_12px_32px_rgba(23,15,46,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-[#E7E4EF] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#F3EEFB] flex items-center justify-center text-[#7B2FD6] font-semibold text-lg">
                      IA
                    </div>
                    <div>
                      <div className="font-semibold text-[#191233]">Teknovra Analyst</div>
                      <div className="text-xs text-[#9C96B5]">Administrator</div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-[#6E6791] hover:bg-[#F7F6FA] transition-colors flex items-center gap-3"
                    >
                      <Settings size={16} className="text-[#9C96B5]" /> Engine Settings
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut size={16} className="text-[#DC2626]" /> Switch to Exec Hub
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto p-8 relative">
          {activeTab === "summary" && renderSummaryTab()}
          {activeTab === "mentions" && renderMentionsTab()}
          {activeTab === "analysis" && renderGeoTab()}
          {activeTab === "authors" && (
            <div className="flex flex-col items-center justify-center h-full text-[#9C96B5] animate-in fade-in">
              <Users size={64} className="opacity-20 mb-4" />
              <p className="font-medium text-lg">Author Demographics Module Ready for API Hookup</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
