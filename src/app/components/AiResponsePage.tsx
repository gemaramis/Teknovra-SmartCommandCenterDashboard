import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import { useMockData } from "../contexts/MockDataContext";

export function AiResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts } = useMockData();
  
  const issue = alerts.find(a => a.id.toString() === id);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F4F2F9] text-[#1A1230]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <h1 className="text-sm font-bold uppercase tracking-widest text-purple-600">AI Response Engine</h1>
      </header>

      <div className="flex-1 overflow-auto p-8 flex justify-center items-center">
        <div className="w-full max-w-xl text-center">
          
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-purple-200 blur-3xl opacity-50 rounded-full" />
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 border border-purple-100">
              <Bot className="w-12 h-12 text-purple-600" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-pulse" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">AI Generation Coming Soon</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto">
            We are fine-tuning our proprietary AI models to generate hyper-contextual PR responses and countermeasures for crisis events.
          </p>

          {issue && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-left mb-8 max-w-sm mx-auto">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target Issue</div>
              <div className="text-sm font-bold text-gray-800">{issue.title}</div>
            </div>
          )}

          <button 
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-purple-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
