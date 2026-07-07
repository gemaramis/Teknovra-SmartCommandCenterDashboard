import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

const SETTINGS_CATEGORIES = [
  { id: "entities", label: "Target Entities" },
  { id: "sources", label: "Data Sources" },
  { id: "engine", label: "Engine Configuration" },
  { id: "keys", label: "API Credentials" },
];

export function EngineSettingsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("entities");

  const [keywords, setKeywords] = useState(["Budiman Sudjatmiko", "Pemilu 2029"]);
  const [newKeyword, setNewKeyword] = useState("");

  const handleSave = () => {
    toast.success("Engine Configuration Saved.");
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

  // Swiss Design uses strict grids, stark contrast, and bold sans-serif typography.
  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#111111] font-sans selection:bg-[#000000] selection:text-white flex flex-col">
      
      {/* Top Header */}
      <header className="px-12 py-8 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate("/operational")}
            className="text-[#111111] hover:opacity-50 transition-opacity flex items-center gap-2 font-bold tracking-tight"
          >
            <ArrowLeft strokeWidth={3} size={20} /> Back
          </button>
          <div className="w-px h-6 bg-[#E5E5E5]" />
          <h1 className="text-3xl font-black tracking-tighter uppercase">Engine Config</h1>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#111111] text-white px-8 py-3 font-bold tracking-tight uppercase flex items-center gap-2 hover:bg-[#333333] transition-colors"
        >
          <Save size={18} strokeWidth={2.5} /> Save Changes
        </button>
      </header>

      {/* Main Grid Layout (Swiss Style 12-column) */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-12 gap-12 p-12">
        
        {/* Left Navigation */}
        <nav className="col-span-3">
          <ul className="flex flex-col gap-6">
            {SETTINGS_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-2xl font-bold tracking-tight text-left transition-colors ${
                    activeCategory === cat.id 
                      ? "text-[#111111] underline decoration-4 underline-offset-8" 
                      : "text-[#999999] hover:text-[#555555]"
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Content Area */}
        <section className="col-span-8 col-start-5">
          
          {activeCategory === "entities" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none">Target Entities</h2>
              <p className="text-[#555555] text-lg font-medium max-w-2xl mb-12 leading-relaxed">
                Define the exact keywords, names, or organizations the intelligence engine should monitor. The engine will trigger data extraction when these entities appear in the Open Web.
              </p>

              <div className="bg-white border-2 border-[#111111] p-8 mb-8">
                <h3 className="text-xl font-bold tracking-tight uppercase mb-6 border-b-2 border-[#111111] pb-2 inline-block">Active Targets</h3>
                <div className="flex flex-wrap gap-4 mb-8">
                  {keywords.map(kw => (
                    <div key={kw} className="bg-[#111111] text-white px-4 py-2 font-bold tracking-tight flex items-center gap-3">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="hover:text-red-400 transition-colors">
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={addKeyword} className="flex gap-4">
                  <input 
                    type="text" 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter new target entity..." 
                    className="flex-1 border-2 border-[#E5E5E5] px-4 py-3 font-medium text-lg outline-none focus:border-[#111111] transition-colors bg-[#F7F7F7]"
                  />
                  <button type="submit" className="bg-[#111111] text-white px-6 font-bold uppercase tracking-tight flex items-center gap-2 hover:bg-[#333333]">
                    <Plus size={20} strokeWidth={3} /> Add
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeCategory === "sources" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none">Data Sources</h2>
              <p className="text-[#555555] text-lg font-medium max-w-2xl mb-12 leading-relaxed">
                Toggle the extraction points. The engine will route requests to these specific endpoints to gather raw intelligence.
              </p>

              <div className="flex flex-col gap-6">
                {[
                  { title: "Google News Aggregation", desc: "Monitors global and local Indonesian news syndication feeds.", active: true },
                  { title: "Indonesian News RSS (Kompas, Detik)", desc: "Direct scraping of top tier Indonesian publisher feeds.", active: true },
                  { title: "Public Web Crawl", desc: "Deep extraction of article bodies and press releases.", active: false },
                  { title: "Social Media Firehose", desc: "X (Twitter) and Instagram data. Requires Enterprise API key.", active: false, locked: true },
                ].map((src, i) => (
                  <div key={i} className={`border-2 p-6 flex justify-between items-center ${src.active ? 'border-[#111111] bg-white' : 'border-[#E5E5E5] bg-[#F7F7F7]'}`}>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold tracking-tight">{src.title}</h3>
                        {src.locked && <span className="bg-[#E5E5E5] text-[#555555] text-xs font-bold px-2 py-1 uppercase tracking-widest">Locked</span>}
                      </div>
                      <p className="text-[#555555] font-medium mt-1">{src.desc}</p>
                    </div>
                    <div className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${src.active ? 'bg-[#111111]' : 'bg-[#D1D1D1]'}`}>
                      <div className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ${src.active ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "engine" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none">Engine Config</h2>
              <p className="text-[#555555] text-lg font-medium max-w-2xl mb-12 leading-relaxed">
                Adjust the frequency and depth of the background crawler. High frequency may exhaust API rate limits.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white border-2 border-[#111111] p-8">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-4">Crawl Frequency</label>
                  <select className="w-full border-2 border-[#E5E5E5] p-4 font-bold text-lg outline-none focus:border-[#111111] bg-[#F7F7F7] appearance-none cursor-pointer">
                    <option>Every 5 Minutes (Aggressive)</option>
                    <option>Every 15 Minutes (Balanced)</option>
                    <option>Hourly (Economy)</option>
                    <option>Daily</option>
                  </select>
                </div>

                <div className="bg-white border-2 border-[#111111] p-8">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-4">Article Body Extraction</label>
                  <select className="w-full border-2 border-[#E5E5E5] p-4 font-bold text-lg outline-none focus:border-[#111111] bg-[#F7F7F7] appearance-none cursor-pointer">
                    <option>Extract Full Body (Deep Analysis)</option>
                    <option>Headlines & Summaries Only</option>
                  </select>
                </div>

                <div className="bg-white border-2 border-[#111111] p-8 col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-4">Database Retention Limit</label>
                  <input type="number" defaultValue={50000} className="w-full border-2 border-[#E5E5E5] p-4 font-bold text-2xl outline-none focus:border-[#111111] bg-[#F7F7F7]" />
                  <p className="text-[#999999] text-sm font-medium mt-2">Maximum number of records to keep before auto-purging.</p>
                </div>
              </div>
            </div>
          )}

          {activeCategory === "keys" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 leading-none">API Credentials</h2>
              <p className="text-[#555555] text-lg font-medium max-w-2xl mb-12 leading-relaxed">
                Securely store the necessary API keys for processing intelligence data through the LLM and storing it in the cloud.
              </p>

              <div className="flex flex-col gap-8">
                <div className="bg-white border-2 border-[#111111] p-8">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-4">Google Gemini API Key (Processing)</label>
                  <input type="password" defaultValue="************************" className="w-full border-2 border-[#E5E5E5] p-4 font-mono text-lg outline-none focus:border-[#111111] bg-[#F7F7F7] mb-2" />
                  <p className="text-[#555555] text-sm font-medium">Used for free-tier Sentiment Analysis and Entity Extraction.</p>
                </div>

                <div className="bg-white border-2 border-[#111111] p-8">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-4">Supabase URL (Database)</label>
                  <input type="url" placeholder="https://xyz.supabase.co" className="w-full border-2 border-[#E5E5E5] p-4 font-mono text-lg outline-none focus:border-[#111111] bg-[#F7F7F7]" />
                </div>
                
                <div className="bg-white border-2 border-[#111111] p-8">
                  <label className="block text-sm font-bold uppercase tracking-widest mb-4">Supabase Anon Key</label>
                  <input type="password" placeholder="eyJhb..." className="w-full border-2 border-[#E5E5E5] p-4 font-mono text-lg outline-none focus:border-[#111111] bg-[#F7F7F7]" />
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
