import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Bot } from "lucide-react";
import { useLiveData } from "../contexts/LiveDataContext";

export function AiResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts } = useLiveData();
  
  const issue = alerts.find(a => a.id.toString() === id);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F7F6FA] text-[#191233]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-[#E7E4EF]">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium text-[#6E6791] hover:text-[#191233] transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="w-px h-5 bg-[#E7E4EF]" />
        <h1 className="text-xs font-semibold uppercase tracking-wider text-[#7B2FD6]">AI Response Engine</h1>
      </header>

      <div className="flex-1 overflow-auto p-8 flex justify-center items-center">
        <div className="w-full max-w-xl text-center">

          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-[#F3EEFB] rounded-2xl flex items-center justify-center">
              <Bot className="w-10 h-10 text-[#7B2FD6]" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-[#191233] mb-4 tracking-tight">AI Generation Coming Soon</h1>
          <p className="text-[#6E6791] text-base leading-relaxed mb-8 max-w-md mx-auto">
            We are fine-tuning our proprietary AI models to generate hyper-contextual PR responses and countermeasures for crisis events.
          </p>

          {issue && (
            <div className="bg-white rounded-xl border border-[#E7E4EF] p-4 text-left mb-8 max-w-sm mx-auto">
              <div className="text-xs font-medium text-[#9C96B5] uppercase tracking-wider mb-1">Target Issue</div>
              <div className="text-sm font-semibold text-[#191233]">{issue.title}</div>
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#7B2FD6] hover:bg-[#6A28BC] text-white font-semibold rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
