import { useState, useEffect } from "react";
import { Search, LayoutDashboard, Clock, Settings, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import logoTeknovra from "../../imports/logo_teknovra.png";
import { IssueBenchmark } from "./IssueBenchmark";
import { LiveDistPanel } from "./LiveDistPanel";
import { AlertPanel } from "./AlertPanel";
import { PersonPanel } from "./PersonPanel";
import { ListMediaPanel } from "./ListMediaPanel";
import { TopIssuePanel } from "./TopIssuePanel";
import { TopSocialPanel } from "./TopSocialPanel";
import { LiveTicker } from "./LiveTicker";
import { ProjectSettingsSheet } from "./ProjectSettingsSheet";
const TIME_FILTERS = ["1H", "6H", "24H", "7D"];

function useTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"general" | "crisis">("general");
  const [timeFilter, setTimeFilter] = useState("24H");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const now = useTime();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/trends/${encodeURIComponent(searchQuery)}`);
    }
  };

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dayStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")} WIB`;

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #F8F6FC 50%, #EBE4F6 100%)", color: "#1A1230", fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-4 px-4 py-2 flex-shrink-0"
        style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255, 255, 255, 0.5)", height: "56px", boxShadow: "0 4px 24px -4px rgba(123,47,214,0.08)", zIndex: 50 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logoTeknovra} alt="Teknovra" className="h-6 object-contain" />
        </div>

        <div style={{ width: "1px", height: "24px", background: "rgba(123,47,214,0.2)" }} />

        <div>
          <div style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Smart Dashboard
          </div>
          <div style={{ color: "#7B6BAA", fontSize: "0.65rem" }}>UPDATE {timeStr}</div>
        </div>

        <div className="flex-1" />

        <button onClick={() => navigate("/report")} className="p-1.5 rounded hover:bg-[#EDE8F9] transition-colors" title="Generate Report">
          <FileText size={16} style={{ color: "#7B6BAA" }} />
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 rounded hover:bg-[#EDE8F9] transition-colors" title="Project Settings">
          <Settings size={16} style={{ color: "#7B6BAA" }} />
        </button>
        <button onClick={() => toast.success("Dashboard layout refreshed")} className="p-1.5 rounded hover:bg-[#EDE8F9] transition-colors">
          <LayoutDashboard size={16} style={{ color: "#7B6BAA" }} />
        </button>
        <button onClick={() => setIsSearchOpen(true)} className="p-1.5 rounded hover:bg-[#EDE8F9] transition-colors">
          <Search size={16} style={{ color: "#7B6BAA" }} />
        </button>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(123,47,214,0.25)" }}>
          {(["general", "crisis"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 transition-all"
              style={{
                background: activeTab === tab
                  ? "linear-gradient(135deg, #7B2FD6, #D946EF)"
                  : "transparent",
                color: activeTab === tab ? "#fff" : "#7B6BAA",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ width: "1px", height: "24px", background: "rgba(123,47,214,0.2)" }} />

        {/* Time filters */}
        <div className="flex gap-1">
          {TIME_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className="px-2.5 py-1 rounded transition-all"
              style={{
                background: timeFilter === t ? "linear-gradient(135deg, #7B2FD6, #D946EF)" : "transparent",
                color: timeFilter === t ? "#fff" : "#7B6BAA",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: timeFilter === t ? "none" : "1px solid rgba(123,47,214,0.2)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Date/time */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:opacity-80"
              style={{ background: "#EDE8F9", border: "1px solid rgba(123,47,214,0.18)" }}
            >
              <Clock size={12} style={{ color: "#7B6BAA" }} />
              <span style={{ color: "#7B6BAA", fontSize: "0.75rem" }}>
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "d MMM yyyy", { locale: id })} - ${format(dateRange.to, "d MMM yyyy", { locale: id })}`
                  ) : (
                    format(dateRange.from, "d MMM yyyy", { locale: id })
                  )
                ) : (
                  dayStr
                )}
              </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #7B2FD6, #D946EF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                }}
              >
                {timeStr}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
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
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </header>

      {/* Main content */}
      {activeTab === "general" ? (
        <div className="flex-1 overflow-hidden p-3 flex gap-3">
          {/* Left Column - 25% */}
          <div className="w-1/4 flex flex-col gap-3">
            <div className="flex-[0.45] min-h-0"><PersonPanel /></div>
            <div className="flex-[0.55] min-h-0"><AlertPanel /></div>
          </div>
          
          {/* Middle Column - 50% */}
          <div className="w-1/2 flex flex-col gap-3">
            <div className="flex-[0.55] min-h-0"><IssueBenchmark /></div>
            <div className="flex-[0.45] min-h-0"><ListMediaPanel /></div>
          </div>
          
          {/* Right Column - 25% */}
          <div className="w-1/4 flex flex-col gap-3">
            <div className="flex-[0.35] min-h-0"><LiveDistPanel /></div>
            <div className="flex-[0.3] min-h-0"><TopIssuePanel /></div>
            <div className="flex-[0.35] min-h-0"><TopSocialPanel /></div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-4xl font-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #7B2FD6, #D946EF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CRISIS MODE
            </div>
            <div style={{ color: "#7B6BAA", fontSize: "0.875rem" }}>Tab Crisis dalam pengembangan</div>
          </div>
        </div>
      )}

      <LiveTicker />

      <ProjectSettingsSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Deep Intelligence Search</DialogTitle>
            <DialogDescription>Enter an issue, keyword, or entity to scrape comprehensive trend data.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mt-2">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <Search className="text-gray-400 mr-2" size={18} />
              <input 
                type="text" 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all channels..."
                className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
              Scrape
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
