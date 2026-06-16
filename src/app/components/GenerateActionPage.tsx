import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, Send, CheckCircle2, AlertCircle, RefreshCw, Image as ImageIcon, Type, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export function GenerateActionPage() {
  const navigate = useNavigate();
  const { alerts } = useMockData();
  
  const [selectedIssueId, setSelectedIssueId] = useState(alerts[0]?.id.toString() || "");
  const [platform, setPlatform] = useState("Twitter");
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("Text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const handleGenerate = async () => {
    if (platform === "News") {
      toast.error("Cannot generate direct responses for News platforms.");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a response prompt.");
      return;
    }

    setIsGenerating(true);
    setGeneratedText("");
    setGeneratedImageUrl("");

    const targetIssue = alerts.find(a => a.id.toString() === selectedIssueId);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      let textResult = "";
      if (format === "Text" || format === "Both") {
        const chatPrompt = `You are an expert PR crisis manager. 
        Context Issue: ${targetIssue?.title}
        Platform: ${platform}
        Goal: ${prompt}
        
        Write a highly professional, concise, and effective response to this issue for the specified platform. Do not include quotes. Keep it under 280 characters if Twitter.`;
        
        const result = await model.generateContent(chatPrompt);
        textResult = result.response.text();
        setGeneratedText(textResult);
      }

      if (format === "Image" || format === "Both") {
        let imagePrompt = prompt;
        try {
          const imagePromptRequest = `Write a highly detailed, comma-separated image generation prompt based on this PR response goal: ${prompt}. Only output the prompt, nothing else. Maximum 30 words.`;
          const result = await model.generateContent(imagePromptRequest);
          imagePrompt = result.response.text().trim();
        } catch (promptError) {
          console.warn("Gemini failed to optimize image prompt, falling back to raw prompt:", promptError);
        }

        try {
          const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
          if (!openRouterKey) throw new Error("Missing OpenRouter API Key");
          
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openRouterKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "sourceful/riverflow-v2.5-fast",
              messages: [{ role: "user", content: imagePrompt }]
            })
          });
          const data = await response.json();
          if (data.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
             setGeneratedImageUrl(data.choices[0].message.images[0].image_url.url);
          } else {
             throw new Error(data.error?.message || "No image returned");
          }
        } catch (openRouterError) {
          console.warn("OpenRouter failed, falling back to SVG:", openRouterError);
          // Fallback SVG
          const svgString = `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#9333EA;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)" />
            <circle cx="400" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="40" />
            <text x="50%" y="50%" fill="white" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">
              ${prompt.substring(0, 50)}...
            </text>
          </svg>`;
          setGeneratedImageUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
        }
      }

      toast.success("Generation complete!");
    } catch (error: any) {
      if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
        toast.error("Rate limit exceeded. Please wait a minute before generating again.");
      } else if (error.message && error.message.includes("503")) {
        toast.error("Google's Gemini servers are temporarily overloaded (503). Please try again in a few moments.");
      } else {
        toast.error(`Error: ${error.message || "Failed to generate content."}`);
      }
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col text-[#1A1230]" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #F8F6FC 50%, #EBE4F6 100%)" }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 shadow-sm z-10" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Hub
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-2 text-purple-600 font-bold uppercase tracking-widest text-sm">
          <Sparkles size={18} /> Action Generator
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 flex gap-6">
        
        {/* Controls Sidebar */}
        <div className="w-[400px] flex flex-col gap-6">
          <div className="rounded-xl p-6 border border-white/50 shadow-sm" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">1. Target Issue</h2>
            <select 
              value={selectedIssueId} 
              onChange={e => setSelectedIssueId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white/50"
            >
              {alerts.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>

          <div className="rounded-xl p-6 border border-white/50 shadow-sm" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">2. Target Platform</h2>
            <div className="grid grid-cols-2 gap-2">
              {["Twitter", "TikTok", "Instagram", "News"].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-colors ${platform === p ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-200/50 text-gray-600 hover:bg-white/50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            {platform === "News" && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50/80 border border-red-100 rounded-lg text-red-600 text-xs font-semibold">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Cannot execute automated responses directly to News publishers.
              </div>
            )}
          </div>

          <div className="rounded-xl p-6 border border-white/50 shadow-sm" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">3. Response Strategy</h2>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Write an apology acknowledging the delay and offering a full refund."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[120px] outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 resize-none bg-white/50"
            />
          </div>

          <div className="rounded-xl p-6 border border-white/50 shadow-sm" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">4. Content Format</h2>
            <div className="flex bg-gray-200/50 p-1 rounded-lg">
              {[
                { id: "Text", icon: Type }, { id: "Image", icon: ImageIcon }, { id: "Both", icon: LayoutTemplate }
              ].map(f => (
                <button
                  key={f.id} onClick={() => setFormat(f.id)}
                  className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 font-bold rounded-md transition-all ${format === f.id ? "bg-white shadow text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <f.icon size={14} /> {f.id}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || platform === "News"}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex justify-center items-center gap-2 uppercase tracking-widest"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            {isGenerating ? "Synthesizing..." : "Generate Action"}
          </button>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 rounded-2xl border border-white/50 shadow-sm overflow-hidden flex flex-col" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          <div className="p-4 border-b border-white/20 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <h2 className="font-bold text-gray-800">Live Content Review</h2>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center">
            {(!generatedText && !generatedImageUrl && !isGenerating) && (
              <div className="text-center text-gray-400 flex flex-col items-center mt-20">
                <LayoutTemplate size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Configure parameters and generate to preview content.</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center gap-4 text-purple-600 mt-20">
                <RefreshCw className="animate-spin w-10 h-10" />
                <p className="font-bold animate-pulse">Running Neural Models...</p>
              </div>
            )}

            {(generatedText || generatedImageUrl) && !isGenerating && (
              <div className="max-w-2xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {generatedImageUrl && (
                  <div className="w-full mb-6 rounded-xl overflow-hidden border border-white/50 shadow-lg" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
                    <img src={generatedImageUrl} alt="Generated UI" className="w-full h-auto object-cover" />
                  </div>
                )}
                {generatedText && (
                  <div className="w-full rounded-xl p-6 border border-white/50 shadow-lg" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">PR</div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Official Response</div>
                          <div className="text-xs text-gray-500">Drafted for {platform}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed mb-6">
                      {generatedText}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-200/50 rounded transition-colors">Edit</button>
                      <button className="px-4 py-1.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded transition-colors shadow-sm">Approve & Publish</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
