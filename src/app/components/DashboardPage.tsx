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
    <div className="flex flex-col h-screen w-screen overflow-hidden select-none bg-[#F7F6FA] text-[#191233]">
      {/* Header */}
      <header
        className="flex items-center gap-4 px-4 py-2 flex-shrink-0 bg-white border-b border-[#E7E4EF]"
        style={{ height: "56px", zIndex: 50 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 flex items-center justify-center text-[#6E6791] rounded-lg border border-[#E7E4EF] hover:bg-[#F7F6FA] hover:text-[#191233] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <img src={logoTeknovra} alt="Teknovra" className="h-6 object-contain" />
        </div>

        <div className="w-px h-6 bg-[#E7E4EF]" />

        <div>
          <div className="text-[0.8rem] font-semibold tracking-tight text-[#191233]">
            Smart Dashboard
          </div>
          <div className="text-[0.65rem] text-[#9C96B5]">Update {timeStr}</div>
        </div>

        <div className="flex-1" />

        <button onClick={() => navigate("/report")} className="p-1.5 rounded-md hover:bg-[#F1EFF6] transition-colors" title="Generate Report">
          <FileText size={16} className="text-[#6E6791]" />
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 rounded-md hover:bg-[#F1EFF6] transition-colors" title="Project Settings">
          <Settings size={16} className="text-[#6E6791]" />
        </button>
        <button onClick={() => toast.success("Dashboard layout refreshed")} className="p-1.5 rounded-md hover:bg-[#F1EFF6] transition-colors">
          <LayoutDashboard size={16} className="text-[#6E6791]" />
        </button>
        <button onClick={() => setIsSearchOpen(true)} className="p-1.5 rounded-md hover:bg-[#F1EFF6] transition-colors">
          <Search size={16} className="text-[#6E6791]" />
        </button>

        {/* Tabs */}
        <div className="flex rounded-lg bg-[#F1EFF6] p-0.5">
          {(["general", "crisis"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-md text-[0.75rem] font-semibold tracking-wide transition-all ${
                activeTab === tab ? "bg-white text-[#7B2FD6] shadow-sm" : "text-[#6E6791] hover:text-[#191233]"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[#E7E4EF]" />

        {/* Time filters */}
        <div className="flex rounded-lg bg-[#F1EFF6] p-0.5">
          {TIME_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold transition-all ${
                timeFilter === t ? "bg-white text-[#7B2FD6] shadow-sm" : "text-[#6E6791] hover:text-[#191233]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Date/time */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-white border border-[#E7E4EF] hover:border-[#C9B2EE] transition-colors">
              <Clock size={12} className="text-[#6E6791]" />
              <span className="text-[0.75rem] text-[#6E6791]">
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
              <span className="text-[0.6875rem] font-semibold text-[#7B2FD6]">
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
          <div className="w-1/4 flex flex-col gap-3 overflow-hidden">
            <div className="flex-[0.45] min-h-0 flex flex-col"><LiveDistPanel /></div>
            <div className="flex-[0.25] min-h-0 flex flex-col"><TopIssuePanel /></div>
            <div className="flex-[0.30] min-h-0 flex flex-col"><TopSocialPanel /></div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-semibold tracking-tight text-[#7B2FD6] mb-3">
              Crisis Mode
            </div>
            <div className="text-sm text-[#6E6791]">Tab Crisis dalam pengembangan</div>
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
            <div className="flex-1 flex items-center bg-white border border-[#E7E4EF] rounded-lg px-3 py-2 focus-within:border-[#7B2FD6] focus-within:ring-1 focus-within:ring-[#7B2FD6] transition-all">
              <Search className="text-[#9C96B5] mr-2" size={18} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all channels..."
                className="flex-1 outline-none text-sm text-[#191233] bg-transparent placeholder-[#9C96B5]"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#7B2FD6] hover:bg-[#6A28BC] text-white text-sm font-semibold rounded-lg transition-colors">
              Scrape
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
