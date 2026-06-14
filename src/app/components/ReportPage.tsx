import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FileText, Download, Mail, Presentation, FileSpreadsheet, X, ArrowLeft, CheckSquare, Square, Printer, Calendar as CalendarIcon, Settings, Target, Check, Database } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ReportPage() {
  const navigate = useNavigate();

  const COLORS = {
    Positif: "#10B981",
    Negatif: "#EF4444",
    Netral: "#9CA3AF"
  };

  // Config States
  const [reportType, setReportType] = useState("Weekly");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [format, setFormat] = useState("PDF");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  
  // Metadata States
  const [reportTitle, setReportTitle] = useState("Comprehensive Analysis Report");
  const [author, setAuthor] = useState("Lead Analyst");
  const [confidentiality, setConfidentiality] = useState("Confidential");
  const [watermark, setWatermark] = useState(false);

  // Data Filters & Modules
  const [sources, setSources] = useState<Record<string, boolean>>({
    "Twitter/X": true, "News Media": true, "TikTok": true, "Instagram": false, "YouTube": false
  });
  
  const [modules, setModules] = useState<Record<string, boolean>>({
    "Executive Summary": true, 
    "Sentiment Analysis": true, 
    "Top Issues Tracking": true, 
    "Media Distribution": true,
    "Competitor Benchmark": false
  });

  const { issues, sentimentData } = useMockData();

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, key: string) => {
    setter(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
    toast.success(`Initializing build for ${format} report...`);
    setTimeout(() => {
      toast.success("Document compiled successfully.");
      if (emails.length > 0) toast.success(`Dispatched to ${emails.length} addresses.`);
      setTimeout(() => navigate("/"), 2000);
    }, 2000);
  };

  // Mock Data for charts based on current state
  const mockTrendData = issues.slice(0, 4).map(iss => ({
    name: iss.label.substring(0, 15) + "...",
    Index: iss.score,
    Mentions: Math.floor(iss.score * 12.5)
  }));

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#F8F9FA] text-[#111827]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-2 flex-shrink-0 bg-white border-b border-gray-200">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600 uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          Return
        </button>
        <div className="w-px h-5 bg-gray-300" />
        <h1 className="text-sm font-bold uppercase tracking-widest text-gray-800 flex items-center gap-2">
          <Printer size={16} className="text-blue-600" />
          Report Compilation Engine
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* CONFIGURATION SIDEBAR (Professional / High-Density) */}
        <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Settings size={12} />
              Metadata & Formatting
            </h2>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Document Title</label>
                <input type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Prepared By</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Classification</label>
                  <select value={confidentiality} onChange={e => setConfidentiality(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-white">
                    <option>Public</option>
                    <option>Internal</option>
                    <option>Confidential</option>
                    <option>Restricted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CalendarIcon size={12} />
              Temporal Scope
            </h2>
            <div className="flex bg-gray-100 p-1 rounded mb-3">
              {["Daily", "Weekly", "Monthly", "Custom"].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`flex-1 text-xs py-1 font-semibold rounded ${reportType === type ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
                >
                  {type}
                </button>
              ))}
            </div>
            {reportType === "Custom" && (
              <div className="flex gap-2 animate-in slide-in-from-top-2">
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5" />
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5" />
              </div>
            )}
          </div>

          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database size={12} />
              Data Ingestion Filters
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(sources).map(([source, active]) => (
                <button 
                  key={source} 
                  onClick={() => handleToggle(setSources, source)}
                  className={`flex items-center gap-2 text-xs p-1.5 rounded border text-left ${active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 text-gray-500"}`}
                >
                  {active ? <CheckSquare size={14} className="text-blue-600" /> : <Square size={14} />}
                  {source}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-b border-gray-100 flex-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={12} />
              Report Modules
            </h2>
            <div className="flex flex-col gap-1">
              {Object.entries(modules).map(([mod, active]) => (
                <button 
                  key={mod} 
                  onClick={() => handleToggle(setModules, mod)}
                  className={`flex items-center gap-3 text-sm p-2 rounded transition-colors ${active ? "bg-gray-100 font-semibold" : "hover:bg-gray-50 text-gray-500"}`}
                >
                  <div className={`w-4 h-4 rounded-sm flex items-center justify-center border ${active ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                    {active && <Check size={12} className="text-white" />}
                  </div>
                  {mod}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-gray-50 border-t border-gray-200">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Download size={12} />
              Export & Distribution
            </h2>
            
            <div className="flex gap-2 mb-4">
              {[
                { id: "PDF", icon: FileText }, { id: "PPTX", icon: Presentation }, { id: "CSV", icon: FileSpreadsheet }
              ].map(f => (
                <button
                  key={f.id} onClick={() => setFormat(f.id)}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded border text-xs font-bold transition-all
                    ${format === f.id ? "bg-white border-blue-600 text-blue-600 shadow-sm" : "bg-transparent border-gray-300 text-gray-500 hover:bg-gray-100"}`}
                >
                  <f.icon size={14} /> {f.id}
                </button>
              ))}
            </div>

            <div className="flex items-center px-2 py-1.5 rounded border border-gray-300 bg-white mb-3 focus-within:border-blue-500">
              <Mail size={14} className="text-gray-400 mr-2" />
              <input 
                type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={handleAddEmail}
                placeholder="Add recipient emails..." className="bg-transparent border-none outline-none text-xs w-full"
              />
            </div>
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {emails.map(email => (
                  <span key={email} className="flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">
                    {email} <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeEmail(email)}/>
                  </span>
                ))}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              className="w-full py-2.5 rounded bg-[#111827] hover:bg-black text-white text-xs font-bold tracking-widest uppercase transition-colors flex justify-center items-center gap-2"
            >
              Compile Document
            </button>
          </div>
        </div>

        {/* LIVE PREVIEW AREA (Light Clean Document Aesthetic) */}
        <div className="flex-1 p-8 overflow-y-auto flex justify-center items-start bg-gray-200">
          
          <div className="w-full max-w-[850px] bg-white shadow-2xl relative" style={{ minHeight: "1100px", padding: "1in" }}>
            
            {/* Watermark */}
            {watermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                <span className="text-[150px] font-bold uppercase rotate-[-45deg] tracking-widest">CONFIDENTIAL</span>
              </div>
            )}

            {/* Document Header */}
            <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end font-sans">
              <div>
                <h1 className="text-3xl font-black text-black tracking-tight mb-1 uppercase">{reportTitle}</h1>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {reportType === "Custom" && customStart && customEnd ? `${customStart} to ${customEnd}` : `${reportType} Analysis`}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${confidentiality === "Public" ? "text-green-600" : "text-red-600"}`}>
                  [{confidentiality}]
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{new Date().toLocaleDateString('en-GB')}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Prepared by: {author}</p>
              </div>
            </div>

            <div className="font-serif text-gray-800 leading-relaxed space-y-8 relative z-10">
              
              {/* Module: Executive Summary */}
              {modules["Executive Summary"] && (
                <section>
                  <h2 className="font-sans text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 text-black">1.0 Executive Summary</h2>
                  <p className="text-sm text-justify mb-4">
                    This document encapsulates the intelligence gathered during the specified temporal scope. Analysis indicates dynamic shifts across monitored topics. The preeminent issue identified is <strong>"{issues[0]?.label}"</strong>, currently recording a severity index of {issues[0]?.score}. Public sentiment remains segmented, with positive engagement largely propelled by digital media verticals.
                  </p>
                  <p className="text-sm text-justify">
                    Data aggregation for this brief included telemetry from {Object.entries(sources).filter(([_, v]) => v).map(([k]) => k).join(", ")}. Systems report nominal ingestion parameters with zero critical SLA breaches during the recording period.
                  </p>
                </section>
              )}

              {/* Module: Sentiment Analysis */}
              {modules["Sentiment Analysis"] && (
                <section>
                  <h2 className="font-sans text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 text-black mt-6">2.0 Aggregate Sentiment Metrics</h2>
                  <div className="flex items-center gap-8">
                    <div className="w-1/3">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={sentimentData} innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                              {sentimentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val: number) => `${val}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="w-2/3 font-sans">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-black text-left">
                            <th className="py-2 text-xs uppercase tracking-wider">Classification</th>
                            <th className="py-2 text-xs uppercase tracking-wider text-right">Volume (%)</th>
                            <th className="py-2 text-xs uppercase tracking-wider text-right">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sentimentData.map(s => (
                            <tr key={s.name} className="border-b border-gray-100">
                              <td className="py-2 font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full block" style={{ background: COLORS[s.name as keyof typeof COLORS] }}/>
                                {s.name}
                              </td>
                              <td className="py-2 text-right font-mono">{s.value}%</td>
                              <td className="py-2 text-right text-xs text-gray-500">Stable</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Module: Top Issues */}
              {modules["Top Issues Tracking"] && (
                <section>
                  <h2 className="font-sans text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-4 text-black mt-6">3.0 Critical Issue Vectors</h2>
                  <div className="h-56 w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ fontSize: '12px', border: '1px solid #E5E7EB', borderRadius: '4px' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar yAxisId="left" dataKey="Index" fill="#111827" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        <Bar yAxisId="right" dataKey="Mentions" fill="#9CA3AF" radius={[2, 2, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-justify">
                    The bar graph above delineates the primary issues tracked during the period. The Severity Index (Black) correlates closely with raw mention volume (Gray), indicating organized propagation networks affecting the top 2 subjects.
                  </p>
                </section>
              )}

              {/* Module: Competitor Benchmark */}
              {modules["Competitor Benchmark"] && (
                <section>
                  <h2 className="font-sans text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 text-black mt-6">4.0 Competitor Benchmarking</h2>
                  <div className="border border-gray-300 p-4 bg-gray-50 text-center">
                    <p className="text-sm font-sans italic text-gray-500">Benchmark matrices generated for Entity A, B, and C. Sub-domain analysis indicates competitive parity in positive media retention.</p>
                  </div>
                </section>
              )}

            </div>

            {/* Footer */}
            <div className="absolute bottom-[1in] left-[1in] right-[1in] border-t border-gray-300 pt-4 font-sans flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
              <span>TEKNOVRA INTELLIGENCE SUITE</span>
              <span>PAGE 1 OF 1</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
