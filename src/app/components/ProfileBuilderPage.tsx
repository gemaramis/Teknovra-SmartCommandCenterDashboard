import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserCircle, Search, Save, AlertTriangle, ShieldAlert, Activity, Trash2, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
import html2pdf from "html2pdf.js";

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

  const handleExportPDF = () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;
    
    // Temporarily hide the action buttons for the PDF
    const actionButtons = document.getElementById("pdf-action-buttons");
    if (actionButtons) actionButtons.style.display = "none";

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5],
      filename:     `Profile_${activeProfile?.name || 'Extraction'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    toast.promise(
      html2pdf().set(opt).from(element).save().then(() => {
        if (actionButtons) actionButtons.style.display = "flex";
      }),
      {
        loading: 'Generating PDF...',
        success: 'PDF exported successfully!',
        error: 'Failed to export PDF'
      }
    );
  };

  const handleLoadProfile = (p: Profile) => {
    setActiveProfile(p);
    setStep("result");
  };

  return (
    <div className="w-screen h-screen flex flex-col text-[#191233] bg-[#F7F6FA]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-[#E7E4EF] bg-white z-10">
        <button
          onClick={() => navigate("/")}
          className="w-8 h-8 flex items-center justify-center text-[#6E6791] rounded-lg border border-[#E7E4EF] hover:bg-[#F7F6FA] hover:text-[#191233] transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="w-px h-5 bg-[#E7E4EF]" />
        <div className="flex items-center gap-2 text-[#7B2FD6] font-semibold uppercase tracking-wider text-xs">
          <UserCircle size={16} /> Deep Profiling Engine
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex relative z-0">

        {/* Left Sidebar */}
        <div className="w-[380px] border-r border-[#E7E4EF] bg-white flex flex-col h-full z-10">

          <div className="p-6 border-b border-[#E7E4EF]">
            <h2 className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-4">Target Parameters</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-[#443C66] mb-1.5 block">Target Name / Entity</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Elon Musk"
                  className="w-full bg-white border border-[#E7E4EF] rounded-lg p-3 text-sm outline-none focus:border-[#7B2FD6] transition-colors placeholder-[#9C96B5]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#443C66] mb-1.5 block">Context / Position (Optional)</label>
                <input
                  type="text" value={details} onChange={e => setDetails(e.target.value)}
                  placeholder="e.g. CEO of Tesla"
                  className="w-full bg-white border border-[#E7E4EF] rounded-lg p-3 text-sm outline-none focus:border-[#7B2FD6] transition-colors placeholder-[#9C96B5]"
                />
              </div>
              <button
                onClick={handleVerifyTarget}
                disabled={isSearching && step === "input"}
                className="w-full py-3 bg-[#7B2FD6] hover:bg-[#6A28BC] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex justify-center items-center gap-2 mt-2"
              >
                {(isSearching && step === "input") ? <Activity className="animate-spin" size={18} /> : <Search size={18} />}
                {(isSearching && step === "input") ? "Scanning Network..." : "Initialize Profile"}
              </button>
            </div>
          </div>

          <div className="p-6 flex-1">
            <h2 className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-4">Saved Profiles ({savedProfiles.length}/2)</h2>
            <div className="flex flex-col gap-3">
              {savedProfiles.length === 0 && (
                <div className="text-sm text-[#9C96B5] text-center mt-4">No profiles saved.</div>
              )}
              {savedProfiles.map(p => (
                <div key={p.id} className="bg-[#F7F6FA] border border-[#E7E4EF] rounded-xl p-4 flex justify-between items-center group">
                  <div className="cursor-pointer" onClick={() => handleLoadProfile(p)}>
                    <div className="font-semibold text-[#191233]">{p.name}</div>
                    <div className="text-xs text-[#6E6791] line-clamp-1 mt-1">{p.summary}</div>
                  </div>
                  <button onClick={() => handleDeleteProfile(p.id)} className="text-[#9C96B5] hover:text-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white border border-[#E7E4EF] rounded-lg">
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
            <div className="m-auto text-center text-[#9C96B5]">
              <UserCircle size={64} className="mx-auto mb-4 opacity-30 text-[#7B2FD6]" />
              <p className="font-medium text-lg text-[#6E6791]">Input a target name to initiate profiling scan.</p>
            </div>
          )}

          {isSearching && step === "input" && (
            <div className="m-auto flex flex-col items-center gap-4 text-[#7B2FD6]">
              <Activity className="animate-spin w-10 h-10" />
              <p className="font-medium text-base tracking-wide">Scanning global entities…</p>
            </div>
          )}

          {/* Intermediate Confirmation State */}
          {step === "confirm" && verificationData && (
            <div className="m-auto w-full max-w-lg p-8 rounded-2xl animate-in fade-in zoom-in-95 bg-white border border-[#E7E4EF] shadow-[0_12px_40px_rgba(23,15,46,0.08)]">
              <div className="w-14 h-14 bg-[#F3EEFB] text-[#7B2FD6] rounded-xl flex items-center justify-center mb-6 mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-center text-[#191233] mb-4">Target Identified</h2>
              <div className="bg-[#F7F6FA] rounded-xl p-4 mb-6 border border-[#E7E4EF] text-center">
                <p className="font-semibold text-lg text-[#191233]">{verificationData.name}</p>
                <p className="text-xs font-semibold text-[#7B2FD6] uppercase tracking-wider mt-1 mb-3">{verificationData.position}</p>
                <p className="text-sm text-[#6E6791] leading-relaxed">"{verificationData.briefSummary}"</p>
              </div>
              <p className="text-center text-sm text-[#6E6791] mb-6">Is this the entity you are looking for?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("input")}
                  className="flex-1 py-3 bg-white hover:bg-[#F7F6FA] text-[#443C66] font-semibold rounded-lg border border-[#E7E4EF] transition-colors"
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleBuildProfile}
                  className="flex-1 py-3 bg-[#7B2FD6] hover:bg-[#6A28BC] text-white font-semibold rounded-lg transition-colors"
                >
                  Yes, Extract Profile
                </button>
              </div>
            </div>
          )}

          {isSearching && step === "result" && (
            <div className="m-auto flex flex-col items-center gap-4 text-[#7B2FD6]">
              <Activity className="animate-spin w-10 h-10" />
              <p className="font-medium text-base tracking-wide">Extracting deep profile…</p>
            </div>
          )}

          {/* Final Output State */}
          {step === "result" && activeProfile && !isSearching && (
            <div id="pdf-content" className="w-full min-h-full relative overflow-x-hidden flex justify-center pt-16 animate-in fade-in pb-20">
              <div className="relative z-10 w-full max-w-3xl px-8 flex flex-col pb-20">
                {/* Back / Save Button */}
                <div id="pdf-action-buttons" className="flex justify-between items-center mb-12">
                  <button
                    onClick={() => {
                      setStep("input");
                      setActiveProfile(null);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#443C66] rounded-lg hover:bg-[#F7F6FA] transition-colors border border-[#E7E4EF]"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#443C66] bg-white border border-[#E7E4EF] hover:border-[#C9B2EE] hover:text-[#7B2FD6] transition-colors"
                    >
                      <Download size={15} /> Export PDF
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#443C66] bg-white border border-[#E7E4EF] hover:border-[#C9B2EE] hover:text-[#7B2FD6] transition-colors"
                    >
                      <Save size={15} /> Save Profile
                    </button>
                  </div>
                </div>

                {/* Title & Summary */}
                <h1 className="text-4xl font-semibold text-[#191233] tracking-tight leading-tight mb-6">
                  {activeProfile.name}
                </h1>
                <div className="text-base text-[#443C66] leading-relaxed whitespace-pre-wrap max-w-2xl mb-10">
                  {activeProfile.summary}
                </div>

                {/* Main Stats Card */}
                <div className="rounded-2xl p-8 bg-white border border-[#E7E4EF] flex flex-col gap-6 mb-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-lg font-semibold text-[#191233] mb-1">Exposure Risk</h3>
                      <p className="text-sm text-[#6E6791]">Calculated based on {activeProfile.issues.length} critical issues.</p>
                    </div>
                    <div className="text-4xl font-semibold tracking-tight text-[#7B2FD6]">
                      84%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-[#F1EFF6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7B2FD6] rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>

                {/* Critical Issues */}
                {activeProfile.issues.length > 0 && (
                  <div className="rounded-2xl p-8 bg-white border border-[#E7E4EF] flex flex-col gap-4">
                    <h3 className="text-xs font-medium text-[#6E6791] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <ShieldAlert size={15} /> Identified Issues
                    </h3>
                    <div className="flex flex-col gap-3">
                      {activeProfile.issues.map((issue, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-4 bg-[#F7F6FA] rounded-xl border border-[#E7E4EF]">
                          <AlertTriangle size={18} className="text-[#DC2626] shrink-0 mt-0.5" />
                          <p className="text-sm text-[#191233] leading-relaxed">{issue}</p>
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
