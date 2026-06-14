import React, { useState } from "react";
import { FileText, Download, Mail, Presentation, FileSpreadsheet, X, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";

interface Props {
  onClose: () => void;
}

export function ReportPage({ onClose }: Props) {
  const [reportType, setReportType] = useState("Weekly");
  const [format, setFormat] = useState("PDF");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const { issues, sentimentData } = useMockData();

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim() !== "") {
      if (emailInput.includes("@")) {
        setEmails([...emails, emailInput.trim()]);
        setEmailInput("");
      } else {
        toast.error("Invalid email address");
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleGenerate = () => {
    toast.success(`Generating ${reportType} report in ${format}...`);
    if (emails.length > 0) {
      setTimeout(() => toast.success(`Report sent to ${emails.length} recipients`), 1500);
    }
    setTimeout(onClose, 2000);
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden" style={{ background: "#F4F2F9" }}>
      {/* Header */}
      <header
        className="flex items-center gap-4 px-6 py-3 flex-shrink-0 bg-white"
        style={{ borderBottom: "1px solid rgba(123,47,214,0.12)", boxShadow: "0 1px 8px rgba(123,47,214,0.07)" }}
      >
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[#EDE8F9] transition-colors text-sm font-semibold"
          style={{ color: "#7B6BAA" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div style={{ width: "1px", height: "24px", background: "rgba(123,47,214,0.2)" }} />
        <h1 className="text-lg font-bold" style={{ color: "#1A1230" }}>Report Generator</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-1/4 bg-white border-r p-6 flex flex-col gap-8 overflow-y-auto" style={{ borderColor: "rgba(123,47,214,0.12)", minWidth: "320px" }}>
          
          {/* Report Type */}
          <div>
            <label className="text-xs font-bold mb-3 block" style={{ color: "#7B6BAA" }}>REPORT FREQUENCY</label>
            <div className="flex flex-wrap gap-2">
              {["Daily", "Weekly", "Monthly", "Yearly", "Custom"].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className="px-4 py-2 rounded text-sm transition-colors font-semibold border"
                  style={{
                    background: reportType === type ? "#7B2FD6" : "#fff",
                    color: reportType === type ? "#fff" : "#1A1230",
                    borderColor: reportType === type ? "#7B2FD6" : "rgba(123,47,214,0.12)"
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="text-xs font-bold mb-3 block" style={{ color: "#7B6BAA" }}>EXPORT FORMAT</label>
            <div className="flex gap-3">
              {[
                { id: "PDF", icon: FileText, color: "#EF4444" },
                { id: "PPTX", icon: Presentation, color: "#F97316" },
                { id: "CSV", icon: FileSpreadsheet, color: "#10B981" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className="flex-1 py-4 flex flex-col items-center justify-center rounded-xl gap-2 transition-all border shadow-sm hover:shadow-md"
                  style={{
                    borderColor: format === f.id ? f.color : "rgba(123,47,214,0.12)",
                    background: format === f.id ? `${f.color}10` : "#fff",
                  }}
                >
                  <f.icon size={24} color={f.color} />
                  <span className="text-sm font-bold" style={{ color: f.color }}>{f.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Target */}
          <div>
            <label className="text-xs font-bold mb-3 block" style={{ color: "#7B6BAA" }}>SEND TO EMAIL (Optional)</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center px-4 py-3 rounded-xl border bg-[#F4F2F9]" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
                <Mail size={16} color="#7B6BAA" className="mr-3" />
                <input 
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleAddEmail}
                  placeholder="Enter email and press Enter"
                  className="bg-transparent border-none outline-none text-sm w-full"
                  style={{ color: "#1A1230" }}
                />
              </div>
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {emails.map(email => (
                    <div key={email} className="flex items-center gap-1 bg-[#7B2FD6] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                      {email}
                      <button onClick={() => removeEmail(email)} className="hover:text-red-300 ml-1 transition-colors"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button 
              onClick={handleGenerate}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-md transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #7B2FD6, #D946EF)" }}
            >
              <Download size={20} />
              Generate & Send
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto items-center">
          <div className="w-full max-w-4xl flex justify-between items-end">
            <h3 className="font-bold text-xl" style={{ color: "#1A1230" }}>Live Report Preview</h3>
            <p className="text-sm font-semibold" style={{ color: "#7B6BAA" }}>Previewing data for: {reportType}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border p-12 flex flex-col gap-8 w-full max-w-4xl" style={{ borderColor: "rgba(123,47,214,0.12)", minHeight: "1000px" }}>
            
            {/* Document Header */}
            <div className="border-b-2 pb-6 flex justify-between items-end" style={{ borderColor: "rgba(123,47,214,0.1)" }}>
              <div>
                <h1 className="text-4xl font-extrabold mb-2" style={{ color: "#1A1230" }}>Teknovra Summary Report</h1>
                <p className="text-lg font-medium" style={{ color: "#7B6BAA" }}>Frequency: {reportType}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold uppercase tracking-wider mb-1" style={{ color: "#7B2FD6" }}>Confidential</p>
                <p className="text-sm font-semibold text-gray-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Snapshot Content */}
            <div className="mt-4">
              <h4 className="text-xl font-bold mb-4 border-l-4 pl-4" style={{ borderColor: "#7B2FD6", color: "#1A1230" }}>Executive Summary</h4>
              <p className="text-base text-gray-700 leading-relaxed">
                During this {reportType.toLowerCase()} period, overall sentiment has shown dynamic shifts. The top trending issue currently is "{issues[0]?.label}" tracking at an index of {issues[0]?.score}. Positive sentiment holds roughly 40-50% of total engagement, driven primarily by online media sources.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-4">
              <div className="bg-[#F4F2F9] rounded-xl p-6 shadow-sm border border-transparent hover:border-[#7B2FD6] transition-colors">
                <h5 className="text-sm font-bold mb-4 tracking-wider" style={{ color: "#7B6BAA" }}>SENTIMENT SNAPSHOT</h5>
                {sentimentData.map(s => (
                  <div key={s.name} className="flex justify-between items-center text-base mb-2 pb-2 border-b border-gray-200 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700">{s.name}</span>
                    <span className="font-bold text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#F4F2F9] rounded-xl p-6 shadow-sm border border-transparent hover:border-[#7B2FD6] transition-colors">
                <h5 className="text-sm font-bold mb-4 tracking-wider" style={{ color: "#7B6BAA" }}>TOP ISSUES</h5>
                {issues.slice(0, 3).map(iss => (
                  <div key={iss.label} className="flex justify-between items-center text-base mb-2 pb-2 border-b border-gray-200 last:border-0 last:pb-0">
                    <span className="truncate w-3/4 font-medium text-gray-700">{iss.label}</span>
                    <span className="font-bold text-gray-900">{iss.score}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-6 rounded-xl" style={{ background: "rgba(5, 150, 105, 0.05)", border: "1px solid rgba(5, 150, 105, 0.2)" }}>
              <div className="flex items-center gap-3 mb-2">
                <Check size={24} color="#059669" />
                <span className="font-bold text-lg" style={{ color: "#059669" }}>System Health Nominal</span>
              </div>
              <p className="text-sm font-medium text-gray-600">All data streams operating within acceptable tolerances. SLA response times averaging under 5 minutes.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
