import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send, Users, Shield, Briefcase, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";

export function EscalationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts } = useLiveData();
  
  const issue = alerts.find(a => a.id.toString() === id);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const departments = [
    { id: "pr", name: "Public Relations Team", icon: Users, desc: "Handle media inquiries and public statements." },
    { id: "legal", name: "Legal Department", icon: Shield, desc: "Review for potential defamation or legal threats." },
    { id: "exec", name: "Executive Board", icon: Briefcase, desc: "High-priority escalation for C-level awareness." },
  ];

  const handleEscalate = () => {
    if (selectedDepts.length === 0) {
      toast.error("Please select at least one department to escalate to.");
      return;
    }
    const names = selectedDepts.map(id => departments.find(d => d.id === id)?.name).join(", ");
    toast.success(`Issue escalated to: ${names}!`);
    setTimeout(() => navigate("/"), 1500);
  };

  const toggleDept = (id: string) => {
    setSelectedDepts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  if (!issue) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F4F2F9]">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Issue Not Found</h1>
        <button onClick={() => navigate("/")} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F4F2F9] text-[#1A1230]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-200">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <h1 className="text-sm font-bold uppercase tracking-widest text-red-600">Manual Escalation Workflow</h1>
      </header>

      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Issue</h2>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{issue.title}</h3>
                <p className="text-sm text-gray-500">Source: <span className="font-semibold">{issue.source}</span> • Type: <span className="font-semibold text-orange-600">{issue.issueType}</span></p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-600 uppercase">Impact: {issue.impact}</div>
                <div className="text-xs text-gray-500">{issue.mentions} Mentions</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">How do you want this to be escalated?</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              {departments.map(dept => {
                const isSelected = selectedDepts.includes(dept.id);
                return (
                <button
                  key={dept.id}
                  onClick={() => toggleDept(dept.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${isSelected ? "border-purple-600 bg-purple-50" : "border-gray-100 hover:border-purple-200 hover:bg-gray-50"}`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    <dept.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{dept.name}</div>
                    <div className="text-xs text-gray-500">{dept.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? "border-purple-600 bg-purple-600" : "border-gray-300 bg-white"}`}>
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                </button>
              )})}
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 block">Additional Context (Optional)</label>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any specific instructions for the team..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[100px] outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <button 
              onClick={handleEscalate}
              className={`w-full py-3 rounded-lg flex justify-center items-center gap-2 font-bold uppercase tracking-widest transition-all ${selectedDepts.length > 0 ? "bg-red-600 hover:bg-red-700 text-white shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              <Send size={16} />
              Confirm Escalation
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
