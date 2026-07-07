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

  const [keywords, setKeywords] = useState(["Budiman Sudjatmiko", "Pemilu 2029"]);
  const [newKeyword, setNewKeyword] = useState("");

  const handleSave = () => {
    toast.success("Engine Configuration Saved Successfully", {
      description: "Background crawler parameters have been updated."
    });
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

  const inputStyle = "w-full bg-white/50 border border-white/60 rounded-xl p-3.5 text-sm outline-none focus:bg-white focus:border-purple-300 transition-colors shadow-inner text-gray-800 font-medium";

  return (
    <div className="min-h-screen flex flex-col text-[#1A1230] font-sans" style={{ background: "linear-gradient(135deg, #E6E0F8 0%, #F5E3F0 50%, #E2EDF8 100%)" }}>
      
      {/* Top Header */}
      <header className="h-20 border-b border-white/40 flex items-center justify-between px-8" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/operational")}
            className="flex items-center gap-2 bg-white/70 hover:bg-white px-4 py-2 rounded-lg font-bold text-sm text-purple-700 shadow-sm transition-colors border border-white/80"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="w-px h-6 bg-white/40" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-gray-800">Engine Settings</span>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <Save size={16} /> Save Configuration
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-12 gap-8 p-8">
        
        {/* Left Navigation (Glass Sidebar) */}
        <nav className="col-span-3 flex flex-col gap-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Configuration Modules</div>
          {SETTINGS_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left group"
                style={isActive ? activeGlassStyle : glassStyle}
              >
                <cat.icon size={18} className={isActive ? "text-purple-600" : "text-gray-500 group-hover:text-purple-400"} />
                <span className={`font-bold ${isActive ? "text-purple-800" : "text-gray-600"}`}>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Content Area (Glass Cards) */}
        <section className="col-span-9 flex flex-col">
          
          {activeCategory === "entities" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-800 mb-2">Target Entities</h2>
                <p className="text-gray-500 text-sm font-medium">
                  Define the exact keywords, names, or organizations the intelligence engine should monitor.
                </p>
              </div>

              <div className="rounded-2xl p-8" style={glassStyle}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-white/50 pb-2">Active Targets</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {keywords.map(kw => (
                    <div key={kw} className="bg-white/70 border border-white shadow-sm text-purple-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all hover:bg-white">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="text-gray-400 hover:text-red-500 transition-colors">
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
                  <button type="submit" className="bg-purple-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> Add Entity
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeCategory === "sources" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-800 mb-2">Data Sources</h2>
                <p className="text-gray-500 text-sm font-medium">
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
                  <div key={i} className={`rounded-2xl p-6 flex justify-between items-center transition-all ${src.active ? 'bg-white/60 border border-purple-200 shadow-md' : 'bg-white/30 border border-white/50'}`} style={{ backdropFilter: "blur(16px)" }}>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-lg font-bold ${src.active ? 'text-gray-900' : 'text-gray-600'}`}>{src.title}</h3>
                        {src.locked && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Locked</span>}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">{src.desc}</p>
                    </div>
                    <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${src.active ? 'bg-purple-500' : 'bg-gray-300'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${src.active ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "engine" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-800 mb-2">Engine Configuration</h2>
                <p className="text-gray-500 text-sm font-medium">
                  Adjust the frequency and depth of the background crawler.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={glassStyle}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Crawl Frequency</label>
                  <div className="relative">
                    <select className={`${inputStyle} appearance-none cursor-pointer pr-10`}>
                      <option>Every 5 Minutes (Aggressive)</option>
                      <option>Every 15 Minutes (Balanced)</option>
                      <option>Hourly (Economy)</option>
                      <option>Daily</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="rounded-2xl p-6" style={glassStyle}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Article Body Extraction</label>
                  <div className="relative">
                    <select className={`${inputStyle} appearance-none cursor-pointer pr-10`}>
                      <option>Extract Full Body (Deep Analysis)</option>
                      <option>Headlines & Summaries Only</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="rounded-2xl p-6 col-span-2" style={glassStyle}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Database Retention Limit</label>
                  <input type="number" defaultValue={50000} className={inputStyle} />
                  <p className="text-gray-400 text-xs font-medium mt-2 ml-1">Maximum number of records to keep before auto-purging.</p>
                </div>
              </div>
            </div>
          )}

          {activeCategory === "keys" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-800 mb-2">API Credentials</h2>
                <p className="text-gray-500 text-sm font-medium">
                  Securely store the necessary API keys for processing intelligence data through the LLM and storing it in the cloud.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-2xl p-6" style={glassStyle}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Google Gemini API Key (Processing)</label>
                  <input type="password" defaultValue="************************" className={`${inputStyle} font-mono`} />
                  <p className="text-gray-400 text-xs font-medium mt-2 ml-1">Used for free-tier Sentiment Analysis and Entity Extraction.</p>
                </div>

                <div className="rounded-2xl p-6" style={glassStyle}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Supabase URL (Database)</label>
                  <input type="url" placeholder="https://xyz.supabase.co" className={`${inputStyle} font-mono`} />
                </div>
                
                <div className="rounded-2xl p-6" style={glassStyle}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Supabase Anon Key</label>
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
