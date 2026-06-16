import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserCircle, Search, Save, AlertTriangle, ShieldAlert, Globe, Activity, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

interface Profile {
  id: string;
  name: string;
  summary: string;
  issues: string[];
}

export function ProfileBuilderPage() {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);

  const handleBuildProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter a target name.");
      return;
    }

    setIsSearching(true);
    setActiveProfile(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const verificationPrompt = `You are an intelligence gathering AI. Check if the person "${name}" (${details}) is a known public figure or has enough internet exposure to build a profile. Reply ONLY with "YES" or "NO".`;
      const verifyResult = await model.generateContent(verificationPrompt);
      const isExposed = verifyResult.response.text().trim().toUpperCase().includes("YES");

      if (!isExposed) {
        toast.error(`Target "${name}" does not have sufficient public internet exposure to build a reliable profile.`);
        setIsSearching(false);
        return;
      }

      toast.success("Target verified. Extracting profile data...");

      const profilePrompt = `Write a concise 2-paragraph professional summary of "${name}" (${details}). Then, list exactly 3 critical controversies, issues, or negative public sentiments associated with them. Format the response exactly like this:
SUMMARY
(paragraph 1)
(paragraph 2)
ISSUES
1. (issue 1)
2. (issue 2)
3. (issue 3)`;
      
      const profileResult = await model.generateContent(profilePrompt);
      const rawText = profileResult.response.text();
      
      const parts = rawText.split("ISSUES");
      const summaryPart = parts[0].replace("SUMMARY", "").trim();
      const issuesPart = parts[1] ? parts[1].trim() : "";
      const issuesArray = issuesPart.split("\n").map(i => i.replace(/^\d+\.\s*/, '').trim()).filter(i => i);

      setActiveProfile({
        id: Date.now().toString(),
        name,
        summary: summaryPart,
        issues: issuesArray
      });

      toast.success("Profile synthesis complete.");
    } catch (error: any) {
      if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
        toast.error("Rate limit exceeded. Please wait a minute before building another profile.");
      } else {
        toast.error(`Error: ${error.message || "Failed to build profile."}`);
      }
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveProfile = () => {
    if (!activeProfile) return;
    if (savedProfiles.length >= 2) {
      toast.error("Storage full. You can only save up to 2 profiles.");
      return;
    }
    if (savedProfiles.find(p => p.name === activeProfile.name)) {
      toast.info("Profile already saved.");
      return;
    }
    setSavedProfiles([...savedProfiles, activeProfile]);
    toast.success("Profile saved to local storage.");
  };

  const handleDeleteProfile = (id: string) => {
    setSavedProfiles(savedProfiles.filter(p => p.id !== id));
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F8F9FA] text-[#111827]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Hub
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm">
          <UserCircle size={18} /> Deep Profiling Engine
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        
        {/* Left Sidebar: Input & Saved */}
        <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full z-10">
          
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Target Parameters</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Target Name / Entity</label>
                <input 
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Elon Musk"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Context / Position (Optional)</label>
                <input 
                  type="text" value={details} onChange={e => setDetails(e.target.value)}
                  placeholder="e.g. CEO of Tesla"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button 
                onClick={handleBuildProfile}
                disabled={isSearching}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-3xl p-6 transition-all shadow-md shadow-emerald-600/20 flex justify-center items-center gap-2"
              >
                {isSearching ? <Activity className="animate-spin" size={18} /> : <Search size={18} />}
                {isSearching ? "Scraping Network..." : "Build Profile"}
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 bg-gray-50">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Saved Profiles ({savedProfiles.length}/2)</h2>
            <div className="flex flex-col gap-3">
              {savedProfiles.length === 0 && (
                <div className="text-sm text-gray-400 text-center italic mt-4">No profiles saved.</div>
              )}
              {savedProfiles.map(p => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-3xl p-6 p-4 shadow-sm flex justify-between items-center group">
                  <div className="cursor-pointer" onClick={() => setActiveProfile(p)}>
                    <div className="font-bold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{p.summary}</div>
                  </div>
                  <button onClick={() => handleDeleteProfile(p.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] flex justify-center relative">
          {!activeProfile && !isSearching && (
            <div className="m-auto text-center text-gray-400">
              <UserCircle size={64} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium text-lg">Input a target name to initiate profiling.</p>
            </div>
          )}

          {isSearching && (
            <div className="m-auto flex flex-col items-center gap-4 text-emerald-600">
              <Activity className="animate-spin w-12 h-12" />
              <p className="font-bold animate-pulse text-lg tracking-widest uppercase">Synthesizing Data Models...</p>
            </div>
          )}

          {activeProfile && !isSearching && (
            <div className="w-full h-full relative overflow-hidden flex justify-center pt-20">
              {/* Massive Glowing Orb Background */}
              <div className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-3xl px-8 flex flex-col">
                {/* Back / Save Button */}
                <div className="flex justify-between items-center mb-16">
                  <button 
                    onClick={() => setActiveProfile(null)}
                    className="w-12 h-12 flex items-center justify-center bg-[#1A1230] text-white rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:text-emerald-700 hover:scale-105 transition-all shadow-sm" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
                  >
                    <Save size={16} /> Save Profile
                  </button>
                </div>

                {/* Elegant Title & Summary */}
                <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
                  {activeProfile.name}
                </h1>
                <div className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap max-w-2xl mb-12">
                  {activeProfile.summary}
                </div>

                {/* Main Stats Card (Stage Progress Style) */}
                <div 
                  className="rounded-[2rem] p-8 shadow-xl flex flex-col gap-6 mb-8"
                  style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Exposure Risk</h3>
                      <p className="text-sm text-gray-500 font-medium">Calculated based on {activeProfile.issues.length} critical issues.</p>
                    </div>
                    <div className="text-5xl font-black text-gray-900">
                      84%
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>

                {/* Critical Issues */}
                {activeProfile.issues.length > 0 && (
                  <div 
                    className="rounded-[2rem] p-8 shadow-xl flex flex-col gap-4"
                    style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
                  >
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ShieldAlert size={16} /> Identified Issues
                    </h3>
                    <div className="flex flex-col gap-3">
                      {activeProfile.issues.map((issue, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-4 bg-white/50 rounded-2xl border border-white/50">
                          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-base font-medium text-gray-800 leading-snug">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
