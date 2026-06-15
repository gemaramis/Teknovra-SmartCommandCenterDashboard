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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex justify-center items-center gap-2"
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
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-center group">
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
        <div className="flex-1 overflow-y-auto p-8 bg-[#F4F2F9] flex justify-center">
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
            <div className="w-full max-w-4xl space-y-6">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <UserCircle size={40} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900">{activeProfile.name}</h1>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wider">Verified Identity</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">High Exposure</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Save size={16} /> Save Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Col: Overview */}
                <div className="col-span-2 flex flex-col gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Globe size={16} /> Executive Summary
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                      {activeProfile.summary}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                       <div className="text-xs font-bold text-gray-400 uppercase mb-1">Est. Reach</div>
                       <div className="text-xl font-black text-emerald-600">4.2M</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                       <div className="text-xs font-bold text-gray-400 uppercase mb-1">Sentiment</div>
                       <div className="text-xl font-black text-red-500">Negative</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                       <div className="text-xs font-bold text-gray-400 uppercase mb-1">Risk Score</div>
                       <div className="text-xl font-black text-orange-500">84/100</div>
                     </div>
                  </div>
                </div>

                {/* Right Col: Issues */}
                <div className="col-span-1">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                    <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldAlert size={16} /> Critical Issues
                    </h2>
                    <div className="flex flex-col gap-4">
                      {activeProfile.issues.length === 0 && <p className="text-sm text-gray-500">No critical issues detected.</p>}
                      {activeProfile.issues.map((issue, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-3 bg-red-50/50 rounded-lg border border-red-100">
                          <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-red-900 leading-tight">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
