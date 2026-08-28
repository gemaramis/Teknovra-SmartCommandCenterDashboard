import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Save, Plus, X, Settings, Database, Activity, Key, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const SETTINGS_CATEGORIES = [
  { id: "entities", label: "Target Entities", icon: Database },
  { id: "sources", label: "Data Sources", icon: Activity },
  { id: "engine", label: "Engine Config", icon: Settings },
  { id: "keys", label: "API Credentials", icon: Key },
];

export function EngineSettingsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("entities");

  const [keywords, setKeywords] = useState(["Budiman Sudjatmiko"]);
  const [crawlFrequency, setCrawlFrequency] = useState("Every 15 Minutes (Balanced)");
  const [newKeyword, setNewKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.target_entities) setKeywords(data.target_entities);
        if (data.crawl_frequency) setCrawlFrequency(data.crawl_frequency);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_entities: keywords,
          crawl_frequency: crawlFrequency
        })
      });
      if (!res.ok) throw new Error("Failed to save");
      
      toast.success("Engine Configuration Saved Successfully", {
        description: "Background crawler parameters have been updated."
      });
    } catch (err) {
      toast.error("Failed to save configuration");
    }
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const glassStyle = {
    background: "#FFFFFF",
    border: "1px solid #E7E4EF",
  };

  const inputStyle = "w-full bg-white border border-[#E7E4EF] rounded-lg p-3 text-sm outline-none focus:border-[#7B2FD6] transition-colors text-[#191233] placeholder-[#9C96B5]";

  return (
    <div className="min-h-screen flex flex-col text-[#191233] bg-[#F7F6FA]">

      {/* Top Header */}
      <header className="h-16 border-b border-[#E7E4EF] bg-white flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/operational")}
            className="flex items-center gap-2 bg-white hover:border-[#C9B2EE] px-4 py-2 rounded-lg font-medium text-sm text-[#6E6791] transition-colors border border-[#E7E4EF]"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
          <div className="w-px h-6 bg-[#E7E4EF]" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7B2FD6] flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#191233]">Engine Settings</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#7B2FD6] hover:bg-[#6A28BC] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Save size={15} /> Save Configuration
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-12 gap-8 p-8">

        {/* Left Navigation */}
        <nav className="col-span-3 flex flex-col gap-1">
          <div className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-2 px-2">Configuration Modules</div>
          {SETTINGS_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isActive ? "bg-[#F3EEFB]" : "hover:bg-white"
                }`}
              >
                <cat.icon size={17} className={isActive ? "text-[#7B2FD6]" : "text-[#9C96B5]"} />
                <span className={`text-sm font-medium ${isActive ? "text-[#7B2FD6]" : "text-[#6E6791]"}`}>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Content Area (Glass Cards) */}
        <section className="col-span-9 flex flex-col">
          
          {activeCategory === "entities" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#191233] mb-2">Target Entities</h2>
                <p className="text-[#6E6791] text-sm">
                  Define the exact keywords, names, or organizations the intelligence engine should monitor.
                </p>
              </div>

              <div className="rounded-xl p-8" style={glassStyle}>
                <h3 className="text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-6 border-b border-[#E7E4EF] pb-3">Active Targets</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {keywords.map(kw => (
                    <div key={kw} className="bg-[#F3EEFB] text-[#5B23A0] px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="text-[#9C96B5] hover:text-[#DC2626] transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={addKeyword} className="flex gap-3">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter new target entity..."
                    className={inputStyle}
                  />
                  <button type="submit" className="bg-[#7B2FD6] text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-[#6A28BC] transition-colors flex items-center gap-2 whitespace-nowrap">
                    <Plus size={15} /> Add Entity
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeCategory === "sources" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#191233] mb-2">Data Sources</h2>
                <p className="text-[#6E6791] text-sm">
                  Toggle the extraction endpoints the crawler will monitor for new data.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { title: "Google News Aggregation", desc: "Monitors global and local Indonesian news syndication feeds.", active: true },
                  { title: "Indonesian News RSS (Kompas, Detik)", desc: "Direct scraping of top tier Indonesian publisher feeds.", active: true },
                  { title: "Public Web Crawl", desc: "Deep extraction of article bodies and press releases.", active: false },
                  { title: "Social Media Firehose", desc: "X (Twitter) and Instagram data. Requires Enterprise API key.", active: false, locked: true },
                ].map((src, i) => (
                  <div key={i} className={`rounded-xl p-6 flex justify-between items-center transition-colors bg-white border ${src.active ? 'border-[#C9B2EE]' : 'border-[#E7E4EF]'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-base font-semibold ${src.active ? 'text-[#191233]' : 'text-[#6E6791]'}`}>{src.title}</h3>
                        {src.locked && <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Locked</span>}
                      </div>
                      <p className="text-[#6E6791] text-sm">{src.desc}</p>
                    </div>
                    <div className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${src.active ? 'bg-[#7B2FD6]' : 'bg-[#D8D3E6]'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-300 ${src.active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "engine" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#191233] mb-2">Engine Configuration</h2>
                <p className="text-[#6E6791] text-sm">
                  Adjust the frequency and depth of the background crawler.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={glassStyle}>
                  <label className="block text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-3">Crawl Frequency</label>
                  <div className="relative">
                    <select 
                      value={crawlFrequency}
                      onChange={(e) => setCrawlFrequency(e.target.value)}
                      className={`${inputStyle} appearance-none cursor-pointer pr-10`}
                    >
                      <option>Every 5 Minutes (Aggressive)</option>
                      <option>Every 15 Minutes (Balanced)</option>
                      <option>Hourly (Economy)</option>
                      <option>Daily</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="rounded-xl p-6" style={glassStyle}>
                  <label className="block text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-3">Article Body Extraction</label>
                  <div className="relative">
                    <select className={`${inputStyle} appearance-none cursor-pointer pr-10`}>
                      <option>Extract Full Body (Deep Analysis)</option>
                      <option>Headlines & Summaries Only</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="rounded-xl p-6 col-span-2" style={glassStyle}>
                  <label className="block text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-3">Database Retention Limit</label>
                  <input type="number" defaultValue={50000} className={inputStyle} />
                  <p className="text-[#9C96B5] text-xs mt-2 ml-1">Maximum number of records to keep before auto-purging.</p>
                </div>
              </div>
            </div>
          )}

          {activeCategory === "keys" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#191233] mb-2">API Credentials</h2>
                <p className="text-[#6E6791] text-sm">
                  Securely store the necessary API keys for processing intelligence data through the LLM and storing it in the cloud.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-xl p-6" style={glassStyle}>
                  <label className="block text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-3">Google Gemini API Key (Processing)</label>
                  <input type="password" defaultValue="************************" className={`${inputStyle} font-mono`} />
                  <p className="text-[#9C96B5] text-xs mt-2 ml-1">Used for free-tier Sentiment Analysis and Entity Extraction.</p>
                </div>

                <div className="rounded-xl p-6" style={glassStyle}>
                  <label className="block text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-3">Supabase URL (Database)</label>
                  <input type="url" placeholder="https://xyz.supabase.co" className={`${inputStyle} font-mono`} />
                </div>
                
                <div className="rounded-xl p-6" style={glassStyle}>
                  <label className="block text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-3">Supabase Anon Key</label>
                  <input type="password" placeholder="eyJhb..." className={`${inputStyle} font-mono`} />
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
