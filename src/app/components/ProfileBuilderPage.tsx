import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserCircle, Search, Save, AlertTriangle, ShieldAlert, Activity, Trash2, CheckCircle2 } from "lucide-react";
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
  
  const [step, setStep] = useState<"input" | "confirm" | "result">("input");
  const [isSearching, setIsSearching] = useState(false);
  const [verificationData, setVerificationData] = useState<{name: string, position: string, briefSummary: string} | null>(null);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);

  const handleVerifyTarget = async () => {
    if (!name.trim()) {
      toast.error("Please enter a target name.");
      return;
    }

    setIsSearching(true);
    setVerificationData(null);
    setActiveProfile(null);
    setStep("input");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const verificationPrompt = `You are an intelligence AI. Check if "${name}" (${details}) has enough internet exposure to build a profile. 
      Respond ONLY in this exact JSON format, no markdown tags:
      {
        "isKnown": boolean,
        "confirmedName": "Their full correct name if known",
        "confirmedPosition": "Their primary title/role",
        "briefSummary": "A 1-sentence summary of who they are."
      }`;
      
      const verifyResult = await model.generateContent(verificationPrompt);
      const text = verifyResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(text);

      if (!data.isKnown) {
        toast.error(`Target Not Found: Insufficient public data footprint for "${name}".`);
        setIsSearching(false);
        return;
      }

      setVerificationData({
        name: data.confirmedName,
        position: data.confirmedPosition,
        briefSummary: data.briefSummary
      });
      setStep("confirm");
      
    } catch (error: any) {
      toast.error(`Verification Failed: ${error.message}`);
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBuildProfile = async () => {
    if (!verificationData) return;
    
    setIsSearching(true);
    setStep("result");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const profilePrompt = `Write a concise 2-paragraph professional summary of "${verificationData.name}" (${verificationData.position}). Then, list exactly 3 critical controversies, issues, or negative public sentiments associated with them. Format the response exactly like this:
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
        name: verificationData.name,
        summary: summaryPart,
        issues: issuesArray
      });

      toast.success("Profile synthesis complete.");
    } catch (error: any) {
      if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
        toast.error("Rate limit exceeded.");
      } else {
        toast.error(`Error: ${error.message || "Failed to build profile."}`);
      }
      setStep("input");
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

  const handleLoadProfile = (p: Profile) => {
    setActiveProfile(p);
    setStep("result");
  };

  return (
    <div className="w-screen h-screen flex flex-col text-[#1A1230]" style={{ background: "linear-gradient(135deg, #E6E0F8 0%, #F5E3F0 50%, #E2EDF8 100%)" }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 shadow-sm z-10" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <button 
          onClick={() => navigate("/")}
          className="w-8 h-8 flex items-center justify-center bg-gray-100/50 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm">
          <UserCircle size={18} /> Deep Profiling Engine
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex relative z-0">
        
        {/* Left Sidebar */}
        <div className="w-[380px] border-r border-white/50 flex flex-col h-full z-10" style={{ background: "rgba(255, 255, 255, 0.3)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
          
          <div className="p-6 border-b border-white/30">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Target Parameters</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Target Name / Entity</label>
                <input 
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Elon Musk"
                  className="w-full bg-white/50 border border-white/60 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Context / Position (Optional)</label>
                <input 
                  type="text" value={details} onChange={e => setDetails(e.target.value)}
                  placeholder="e.g. CEO of Tesla"
                  className="w-full bg-white/50 border border-white/60 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={handleVerifyTarget}
                disabled={isSearching && step === "input"}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex justify-center items-center gap-2 mt-2"
              >
                {(isSearching && step === "input") ? <Activity className="animate-spin" size={18} /> : <Search size={18} />}
                {(isSearching && step === "input") ? "Scanning Network..." : "Initialize Profile"}
              </button>
            </div>
          </div>

          <div className="p-6 flex-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Saved Profiles ({savedProfiles.length}/2)</h2>
            <div className="flex flex-col gap-3">
              {savedProfiles.length === 0 && (
                <div className="text-sm text-gray-400 text-center italic mt-4">No profiles saved.</div>
              )}
              {savedProfiles.map(p => (
                <div key={p.id} className="bg-white/60 border border-white/50 rounded-2xl p-4 shadow-sm flex justify-between items-center group backdrop-blur-md">
                  <div className="cursor-pointer" onClick={() => handleLoadProfile(p)}>
                    <div className="font-bold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-1">{p.summary}</div>
                  </div>
                  <button onClick={() => handleDeleteProfile(p.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-lg shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 overflow-y-auto flex justify-center relative">
          
          {step === "input" && !isSearching && (
            <div className="m-auto text-center text-gray-400">
              <UserCircle size={64} className="mx-auto mb-4 opacity-30 text-emerald-600" />
              <p className="font-medium text-lg text-gray-500">Input a target name to initiate profiling scan.</p>
            </div>
          )}

          {isSearching && step === "input" && (
            <div className="m-auto flex flex-col items-center gap-4 text-emerald-600">
              <Activity className="animate-spin w-12 h-12" />
              <p className="font-bold animate-pulse text-lg tracking-widest uppercase">Scanning Global Entities...</p>
            </div>
          )}

          {/* Intermediate Confirmation State */}
          {step === "confirm" && verificationData && (
            <div className="m-auto w-full max-w-lg p-8 rounded-[2rem] shadow-xl animate-in fade-in zoom-in-95 border border-white/80" style={{ background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Target Identified</h2>
              <div className="bg-white/50 rounded-xl p-4 mb-6 border border-white/50 text-center">
                <p className="font-bold text-lg text-gray-800">{verificationData.name}</p>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1 mb-3">{verificationData.position}</p>
                <p className="text-sm text-gray-600 leading-relaxed">"{verificationData.briefSummary}"</p>
              </div>
              <p className="text-center text-sm font-bold text-gray-500 mb-6">Is this the entity you are looking for?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep("input")}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 transition-colors shadow-sm"
                >
                  No, Cancel
                </button>
                <button 
                  onClick={handleBuildProfile}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Yes, Extract Profile
                </button>
              </div>
            </div>
          )}

          {isSearching && step === "result" && (
            <div className="m-auto flex flex-col items-center gap-4 text-emerald-600">
              <Activity className="animate-spin w-12 h-12" />
              <p className="font-bold animate-pulse text-lg tracking-widest uppercase">Extracting Deep Profile...</p>
            </div>
          )}

          {/* Final Output State */}
          {step === "result" && activeProfile && !isSearching && (
            <div className="w-full h-full relative overflow-hidden flex justify-center pt-20 animate-in fade-in">
              {/* Massive Glowing Orb Background */}
              <div className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-3xl px-8 flex flex-col pb-20">
                {/* Back / Save Button */}
                <div className="flex justify-between items-center mb-16">
                  <button 
                    onClick={() => {
                      setStep("input");
                      setActiveProfile(null);
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-white/50 text-gray-800 rounded-2xl hover:bg-white transition-colors shadow-sm border border-white/60 backdrop-blur-md"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-gray-800 hover:text-emerald-700 hover:scale-105 transition-all shadow-sm" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
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
                  style={{ background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
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
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>

                {/* Critical Issues */}
                {activeProfile.issues.length > 0 && (
                  <div 
                    className="rounded-[2rem] p-8 shadow-xl flex flex-col gap-4"
                    style={{ background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255, 255, 255, 0.8)" }}
                  >
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ShieldAlert size={16} /> Identified Issues
                    </h3>
                    <div className="flex flex-col gap-3">
                      {activeProfile.issues.map((issue, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-4 bg-white/60 rounded-2xl border border-white/50 backdrop-blur-md">
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
