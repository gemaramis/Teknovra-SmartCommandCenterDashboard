import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, Users, Activity, BarChart3, Globe, Search } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export function SearchScrapingPage() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(query || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/trends/${encodeURIComponent(searchInput)}`);
    }
  };

  // Mock Data
  const trendData = [
    { time: "00:00", value: 12 }, { time: "04:00", value: 15 }, { time: "08:00", value: 35 },
    { time: "12:00", value: 85 }, { time: "16:00", value: 100 }, { time: "20:00", value: 75 },
    { time: "24:00", value: 40 }
  ];

  const sourceData = [
    { name: "Twitter/X", value: 85, color: "#1DA1F2" },
    { name: "TikTok", value: 65, color: "#000000" },
    { name: "News Media", value: 45, color: "#EF4444" },
    { name: "Instagram", value: 30, color: "#E1306C" },
  ];

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-2 text-purple-600 font-bold uppercase tracking-widest text-sm">
          <Activity size={18} /> Deep Scraping Engine
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter an issue, keyword, or entity to scrape..."
                className="flex-1 outline-none text-lg text-gray-800 bg-transparent placeholder-gray-400"
              />
            </div>
            <button type="submit" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-md">
              Scrape Data
            </button>
          </form>

          {/* Headline Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Target Keyword</div>
              <div className="text-xl font-black text-gray-900 truncate">"{query}"</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Exposure Volume</div>
              <div className="text-xl font-black text-blue-600 flex items-center gap-2"><Globe size={18}/> 14.2M Reach</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Overall Sentiment</div>
              <div className="text-xl font-black text-red-500 flex items-center gap-2"><TrendingUp size={18}/> Negative (68%)</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Unique Authors</div>
              <div className="text-xl font-black text-purple-600 flex items-center gap-2"><Users size={18}/> 125,430</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interest Over Time */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 size={16} className="text-purple-600"/> Interest Over Time (24H)
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#9333EA" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Source Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe size={16} className="text-purple-600"/> Platform Distribution
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} width={80} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Related Queries */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">Related Trending Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Hoax klarifikasi", "Viral di tiktok", "Video aslinya mana", "Komentar netizen",
                "Tanggapan pemerintah", "Bukti baru", "Boikot", "Trending topic hari ini"
              ].map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-purple-300 cursor-pointer transition-colors">
                  <span className="text-sm font-medium text-gray-700">{topic}</span>
                  <TrendingUp size={14} className="text-purple-500" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
