import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FileText, Download, Mail, Presentation, FileSpreadsheet, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportGeneratorModal({ isOpen, onClose }: Props) {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden" style={{ background: "#F4F2F9" }}>
        <DialogHeader className="p-4 bg-white border-b" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
          <DialogTitle style={{ color: "#1A1230" }}>Generate Report</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-1/3 bg-white border-r p-4 flex flex-col gap-6 overflow-y-auto" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
            
            {/* Report Type */}
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: "#7B6BAA" }}>REPORT FREQUENCY</label>
              <div className="flex flex-wrap gap-2">
                {["Daily", "Weekly", "Monthly", "Yearly", "Custom"].map(type => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className="px-3 py-1.5 rounded text-xs transition-colors"
                    style={{
                      background: reportType === type ? "#7B2FD6" : "#F4F2F9",
                      color: reportType === type ? "#fff" : "#1A1230",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: "#7B6BAA" }}>EXPORT FORMAT</label>
              <div className="flex gap-2">
                {[
                  { id: "PDF", icon: FileText, color: "#EF4444" },
                  { id: "PPTX", icon: Presentation, color: "#F97316" },
                  { id: "CSV", icon: FileSpreadsheet, color: "#10B981" }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className="flex-1 py-3 flex flex-col items-center justify-center rounded-lg gap-2 transition-all border"
                    style={{
                      borderColor: format === f.id ? f.color : "rgba(123,47,214,0.12)",
                      background: format === f.id ? `${f.color}10` : "#fff",
                    }}
                  >
                    <f.icon size={20} color={f.color} />
                    <span className="text-xs font-semibold" style={{ color: f.color }}>{f.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Target */}
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: "#7B6BAA" }}>SEND TO EMAIL (Optional)</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center px-3 py-2 rounded-lg border bg-[#F4F2F9]" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
                  <Mail size={14} color="#7B6BAA" className="mr-2" />
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
                  <div className="flex flex-wrap gap-1 mt-1">
                    {emails.map(email => (
                      <div key={email} className="flex items-center gap-1 bg-[#7B2FD6] text-white px-2 py-1 rounded-full text-xs">
                        {email}
                        <button onClick={() => removeEmail(email)} className="hover:text-red-300"><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto">
              <button 
                onClick={handleGenerate}
                className="w-full py-3 rounded-lg flex items-center justify-center gap-2 text-white font-bold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7B2FD6, #D946EF)" }}
              >
                <Download size={16} />
                Generate & Send
              </button>
            </div>
          </div>

          {/* Live Preview Area */}
          <div className="w-2/3 p-6 flex flex-col gap-4 overflow-y-auto">
            <h3 className="font-bold text-lg" style={{ color: "#1A1230" }}>Live Report Preview</h3>
            
            <div className="bg-white rounded-xl shadow-sm border p-8 flex flex-col gap-6 transform origin-top" style={{ borderColor: "rgba(123,47,214,0.12)", minHeight: "800px" }}>
              
              {/* Document Header */}
              <div className="border-b pb-4 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1A1230" }}>Teknovra Summary Report</h1>
                  <p className="text-sm" style={{ color: "#7B6BAA" }}>Frequency: {reportType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "#7B2FD6" }}>Confidential</p>
                  <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Snapshot Content */}
              <div>
                <h4 className="text-md font-bold mb-3 border-l-4 pl-2" style={{ borderColor: "#7B2FD6" }}>Executive Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  During this {reportType.toLowerCase()} period, overall sentiment has shown dynamic shifts. The top trending issue currently is "{issues[0]?.label}" tracking at an index of {issues[0]?.score}. Positive sentiment holds roughly 40-50% of total engagement, driven primarily by online media sources.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F4F2F9] rounded-lg p-4">
                  <h5 className="text-xs font-bold mb-2 text-gray-500">SENTIMENT SNAPSHOT</h5>
                  {sentimentData.map(s => (
                    <div key={s.name} className="flex justify-between items-center text-sm mb-1">
                      <span>{s.name}</span>
                      <span className="font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F4F2F9] rounded-lg p-4">
                  <h5 className="text-xs font-bold mb-2 text-gray-500">TOP ISSUES</h5>
                  {issues.slice(0, 3).map(iss => (
                    <div key={iss.label} className="flex justify-between items-center text-sm mb-1">
                      <span className="truncate w-3/4">{iss.label}</span>
                      <span className="font-semibold">{iss.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-lg" style={{ background: "rgba(5, 150, 105, 0.1)", border: "1px solid rgba(5, 150, 105, 0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Check size={16} color="#059669" />
                  <span className="font-bold text-sm" style={{ color: "#059669" }}>System Health Nominal</span>
                </div>
                <p className="text-xs text-gray-600">All data streams operating within acceptable tolerances. SLA response times averaging under 5 minutes.</p>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
