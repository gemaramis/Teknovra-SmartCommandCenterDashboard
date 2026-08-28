import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, Send, CheckCircle2, AlertCircle, RefreshCw, Image as ImageIcon, Type, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export function GenerateActionPage() {
  const navigate = useNavigate();
  const { alerts } = useLiveData();
  
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
          <Sparkles size={16} /> Action Generator
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 flex gap-6">

        {/* Controls Sidebar */}
        <div className="w-[400px] flex flex-col gap-4">
          <div className="rounded-xl p-5 bg-white border border-[#E7E4EF]">
            <h2 className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-4">1. Target Issue</h2>
            <select
              value={selectedIssueId}
              onChange={e => setSelectedIssueId(e.target.value)}
              className="w-full border border-[#E7E4EF] rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#7B2FD6] bg-white transition-colors"
            >
              {alerts.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>

          <div className="rounded-xl p-5 bg-white border border-[#E7E4EF]">
            <h2 className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-4">2. Target Platform</h2>
            <div className="grid grid-cols-2 gap-2">
              {["Twitter", "TikTok", "Instagram", "News"].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${platform === p ? "border-[#7B2FD6] bg-[#F3EEFB] text-[#7B2FD6]" : "border-[#E7E4EF] text-[#6E6791] hover:bg-[#F7F6FA]"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            {platform === "News" && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-[#FEF2F2] border border-red-100 rounded-lg text-[#DC2626] text-xs font-medium">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Cannot execute automated responses directly to News publishers.
              </div>
            )}
          </div>

          <div className="rounded-xl p-5 bg-white border border-[#E7E4EF]">
            <h2 className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-4">3. Response Strategy</h2>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Write an apology acknowledging the delay and offering a full refund."
              className="w-full border border-[#E7E4EF] rounded-lg p-3 text-sm min-h-[120px] outline-none focus:border-[#7B2FD6] resize-none bg-white transition-colors placeholder-[#9C96B5]"
            />
          </div>

          <div className="rounded-xl p-5 bg-white border border-[#E7E4EF]">
            <h2 className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-4">4. Content Format</h2>
            <div className="flex bg-[#F1EFF6] p-0.5 rounded-lg">
              {[
                { id: "Text", icon: Type }, { id: "Image", icon: ImageIcon }, { id: "Both", icon: LayoutTemplate }
              ].map(f => (
                <button
                  key={f.id} onClick={() => setFormat(f.id)}
                  className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 font-semibold rounded-md transition-all ${format === f.id ? "bg-white shadow-sm text-[#7B2FD6]" : "text-[#6E6791] hover:text-[#191233]"}`}
                >
                  <f.icon size={14} /> {f.id}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || platform === "News"}
            className="w-full py-3 bg-[#7B2FD6] hover:bg-[#6A28BC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            {isGenerating ? "Synthesizing..." : "Generate Action"}
          </button>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 rounded-xl bg-white border border-[#E7E4EF] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E7E4EF] flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#059669]" />
            <h2 className="font-semibold text-[#191233] text-sm">Live Content Review</h2>
          </div>

          <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center">
            {(!generatedText && !generatedImageUrl && !isGenerating) && (
              <div className="text-center text-[#9C96B5] flex flex-col items-center mt-20">
                <LayoutTemplate size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Configure parameters and generate to preview content.</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center gap-4 text-[#7B2FD6] mt-20">
                <RefreshCw className="animate-spin w-9 h-9" />
                <p className="font-medium">Running neural models…</p>
              </div>
            )}

            {(generatedText || generatedImageUrl) && !isGenerating && (
              <div className="max-w-2xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {generatedImageUrl && (
                  <div className="w-full mb-6 rounded-xl overflow-hidden border border-[#E7E4EF]">
                    <img src={generatedImageUrl} alt="Generated UI" className="w-full h-auto object-cover" />
                  </div>
                )}
                {generatedText && (
                  <div className="w-full rounded-xl p-6 border border-[#E7E4EF] bg-[#F7F6FA]">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E7E4EF]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F3EEFB] flex items-center justify-center text-[#7B2FD6] font-semibold text-sm">PR</div>
                        <div>
                          <div className="text-sm font-semibold text-[#191233]">Official Response</div>
                          <div className="text-xs text-[#9C96B5]">Drafted for {platform}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[#191233] whitespace-pre-wrap text-sm leading-relaxed mb-6">
                      {generatedText}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="px-4 py-1.5 text-sm font-medium text-[#6E6791] hover:bg-[#F1EFF6] rounded-lg transition-colors">Edit</button>
                      <button className="px-4 py-1.5 text-sm font-semibold text-white bg-[#7B2FD6] hover:bg-[#6A28BC] rounded-lg transition-colors">Approve &amp; Publish</button>
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
