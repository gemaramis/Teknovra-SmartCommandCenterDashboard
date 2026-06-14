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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
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
        const imagePromptRequest = `Write a highly detailed, comma-separated image generation prompt based on this goal: ${prompt}. Only output the prompt, nothing else.`;
        const result = await model.generateContent(imagePromptRequest);
        const imagePrompt = result.response.text();
        const safePrompt = encodeURIComponent(imagePrompt.trim());
        setGeneratedImageUrl(`https://image.pollinations.ai/prompt/${safePrompt}?nologo=true&width=800&height=400`);
      }

      toast.success("Generation complete!");
    } catch (error) {
      toast.error("Failed to generate content. Please check API key or try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F4F2F9] text-[#1A1230]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
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
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">1. Target Issue</h2>
            <select 
              value={selectedIssueId} 
              onChange={e => setSelectedIssueId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-semibold outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              {alerts.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">2. Target Platform</h2>
            <div className="grid grid-cols-2 gap-2">
              {["Twitter", "TikTok", "Instagram", "News"].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-colors ${platform === p ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            {platform === "News" && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-semibold">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Cannot execute automated responses directly to News publishers.
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">3. Response Strategy</h2>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Write an apology acknowledging the delay and offering a full refund."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[120px] outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 resize-none"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">4. Content Format</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
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
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <h2 className="font-bold text-gray-800">Live Content Review</h2>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto bg-gray-50 flex flex-col items-center justify-center">
            {(!generatedText && !generatedImageUrl && !isGenerating) && (
              <div className="text-center text-gray-400 flex flex-col items-center">
                <LayoutTemplate size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Configure parameters and generate to preview content.</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center gap-4 text-purple-600">
                <RefreshCw className="animate-spin w-10 h-10" />
                <p className="font-bold animate-pulse">Running Neural Models...</p>
              </div>
            )}

            {(generatedText || generatedImageUrl) && !isGenerating && (
              <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">PR</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Official Response</div>
                    <div className="text-xs text-gray-500">Drafted for {platform}</div>
                  </div>
                </div>
                
                {generatedText && (
                  <div className="p-5 text-gray-800 whitespace-pre-wrap text-sm leading-relaxed border-b border-gray-50">
                    {generatedText}
                  </div>
                )}
                
                {generatedImageUrl && (
                  <div className="p-2">
                    <img src={generatedImageUrl} alt="Generated visual asset" className="w-full rounded-lg object-cover" />
                  </div>
                )}

                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  <button className="px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded transition-colors">Edit</button>
                  <button className="px-4 py-1.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded transition-colors shadow-sm">Approve & Publish</button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
