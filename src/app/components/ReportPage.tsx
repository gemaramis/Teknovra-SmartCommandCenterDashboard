import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FileText, Download, Mail, Presentation, FileSpreadsheet, X, ArrowLeft, CheckSquare, Square, Printer, Calendar as CalendarIcon, Settings, Target, Check, Database, Twitter, Newspaper, Video, Instagram as InstagramIcon, Youtube } from "lucide-react";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";
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
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  
  // Metadata States
  const [reportTitle, setReportTitle] = useState("Comprehensive Analysis Report");
  const [author, setAuthor] = useState("Lead Analyst");
  const [confidentiality, setConfidentiality] = useState("Confidential");
  const [watermark, setWatermark] = useState(false);

  // Data Filters & Modules
  const [sources, setSources] = useState<Record<string, boolean>>({
    "Twitter/X": true, "News Media": true, "TikTok": true, "Instagram": false, "YouTube": false
  });
  
  const SOURCE_ICONS: Record<string, any> = {
    "Twitter/X": Twitter,
    "News Media": Newspaper,
    "TikTok": Video,
    "Instagram": InstagramIcon,
    "YouTube": Youtube
  };

  const [modules, setModules] = useState<Record<string, boolean>>({
    "Executive Summary": true, 
    "Sentiment Analysis": true, 
    "Top 5 Issues": true, 
    "Issue Benchmark": true,
    "Top Media & Distribution": true,
    "Top Social Posts": false,
    "Alerts & Threat Tracking": false,
    "Key Figures & Persons": false,
  });

  const { issues, sentimentData } = useLiveData();

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, key: string) => {
    setter(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim() !== "") {
      if (emails.length >= 5) {
        toast.error("Maximum 5 recipients allowed");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailInput.trim())) {
        if (!emails.includes(emailInput.trim())) {
          setEmails([...emails, emailInput.trim()]);
        }
        setEmailInput("");
      } else {
        toast.error("Invalid email address format");
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleGenerate = () => {
    toast.success(`Generating ${format} report...`);
    setTimeout(() => {
      toast.success("Document generated successfully!");
      if (emails.length > 0) toast.success(`Sent to ${emails.length} recipients.`);
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
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#F4F2F9] text-[#1A1230] font-sans">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3 flex-shrink-0 bg-white border-b border-[#E5E0F1] shadow-sm z-20 relative">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F4F2F9] transition-colors text-sm font-semibold text-[#4B3F80]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div className="w-px h-6 bg-[#E5E0F1]" />
        <h1 className="text-base font-bold text-[#1A1230] flex items-center gap-2">
          <Printer size={18} className="text-[#7B2FD6]" />
          Report Generator
        </h1>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F4F2F9] p-1 rounded-lg border border-[#E5E0F1]">
            {[
              { id: "PDF", icon: FileText }, { id: "CSV", icon: FileSpreadsheet }, { id: "PPT", icon: Presentation }
            ].map(f => (
              <button
                key={f.id} onClick={() => setFormat(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all
                  ${format === f.id ? "bg-white text-[#7B2FD6] shadow-sm" : "text-[#7B6BAA] hover:text-[#4B3F80]"}`}
              >
                <f.icon size={14} /> {f.id}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-[#E5E0F1] mx-1" />

          <button 
            onClick={handleGenerate}
            className="px-5 py-2 rounded-lg text-white text-sm font-bold shadow-md transition-all hover:shadow-lg hover:opacity-90 flex justify-center items-center gap-2"
            style={{ background: "linear-gradient(135deg, #7B2FD6, #D946EF)" }}
          >
            <Download size={16} />
            Download Report
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowEmailDropdown(!showEmailDropdown)}
              className="px-4 py-2 rounded-lg text-[#7B2FD6] text-sm font-bold border border-[#7B2FD6] transition-all hover:bg-[#F8F5FF] flex justify-center items-center gap-2 bg-white"
            >
              <Mail size={16} />
              Send to Email
            </button>

            {showEmailDropdown && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#E5E0F1] rounded-3xl p-6 shadow-[0_8px_30px_rgba(123,47,214,0.12)] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-[#1A1230]">Recipients ({emails.length}/5)</h3>
                  <button onClick={() => setShowEmailDropdown(false)} className="text-[#9CA3AF] hover:text-[#1A1230]">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="flex items-center px-3 py-2 rounded-lg border border-[#E5E0F1] bg-white mb-3 shadow-sm focus-within:border-[#7B2FD6] focus-within:ring-1 focus-within:ring-[#7B2FD6] transition-all">
                  <Mail size={16} className="text-[#7B6BAA] mr-2" />
                  <input 
                    type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={handleAddEmail}
                    disabled={emails.length >= 5}
                    placeholder={emails.length >= 5 ? "Maximum 5 emails reached" : "Add recipient emails (Enter)"} className="bg-transparent border-none outline-none text-sm w-full text-[#1A1230] placeholder-[#9CA3AF] disabled:opacity-50"
                  />
                </div>
                
                {emails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
                    {emails.map(email => (
                      <span key={email} className="flex items-center gap-1.5 bg-[#EDE8F9] text-[#4B3F80] px-2.5 py-1 rounded-md text-xs font-semibold break-all">
                        {email} <X size={12} className="cursor-pointer hover:text-[#EF4444] flex-shrink-0" onClick={() => removeEmail(email)}/>
                      </span>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => {
                    handleGenerate();
                    setShowEmailDropdown(false);
                  }}
                  disabled={emails.length === 0}
                  className={`w-full py-2.5 rounded-lg text-white text-sm font-bold shadow-md transition-all flex justify-center items-center gap-2 ${emails.length === 0 ? "opacity-50 cursor-not-allowed bg-gray-400 border-none" : "hover:shadow-lg hover:opacity-90"}`}
                  style={emails.length > 0 ? { background: "linear-gradient(135deg, #7B2FD6, #D946EF)" } : {}}
                >
                  <Mail size={16} />
                  Send Report
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* CONFIGURATION SIDEBAR */}
        <div className="w-[380px] bg-white border-r border-[#E5E0F1] flex flex-col shadow-[4px_0_24px_rgba(123,47,214,0.04)] z-10">
          
          <div className="p-6 border-b border-[#E5E0F1] bg-white z-20 flex-shrink-0">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#7B6BAA] mb-1.5 block">Document Title</label>
                <input type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full text-sm border border-[#E5E0F1] rounded-lg px-3 py-2 focus:border-[#7B2FD6] outline-none transition-all text-[#1A1230]" />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[#7B6BAA] mb-1.5 block">Prepared By</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full text-sm border border-[#E5E0F1] rounded-lg px-3 py-2 focus:border-[#7B2FD6] outline-none transition-all text-[#1A1230]" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[#7B6BAA] mb-1.5 block">Classification</label>
                  <select value={confidentiality} onChange={e => setConfidentiality(e.target.value)} className="w-full text-sm border border-[#E5E0F1] rounded-lg px-3 py-2 focus:border-[#7B2FD6] outline-none bg-white transition-all text-[#1A1230]">
                    <option>Public</option>
                    <option>Internal</option>
                    <option>Confidential</option>
                    <option>Restricted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7B6BAA] mb-1.5 block">Time Period</label>
                <div className="flex items-center gap-4">
                  {["Daily", "Weekly", "Monthly", "Custom"].map(type => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1230] transition-colors"
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${reportType === type ? "border-[#7B2FD6]" : "border-[#E5E0F1]"}`}>
                        {reportType === type && <div className="w-2 h-2 rounded-full bg-[#7B2FD6]" />}
                      </div>
                      {type}
                    </button>
                  ))}
                </div>
                {reportType === "Custom" && (
                  <div className="flex gap-3 mt-3 animate-in slide-in-from-top-2">
                    <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="flex-1 text-sm border border-[#E5E0F1] rounded-lg px-3 py-2 focus:border-[#7B2FD6] outline-none text-[#1A1230]" />
                    <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="flex-1 text-sm border border-[#E5E0F1] rounded-lg px-3 py-2 focus:border-[#7B2FD6] outline-none text-[#1A1230]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-bold text-[#1A1230] mb-4 flex items-center gap-2">
                <Database size={16} className="text-[#7B2FD6]" />
                Data Sources
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(sources).map(([source, active]) => {
                  const Icon = SOURCE_ICONS[source] || Database;
                  return (
                    <button 
                      key={source} 
                      onClick={() => handleToggle(setSources, source)}
                      className={`flex flex-col items-center justify-center gap-1.5 text-[11px] p-2 rounded-lg border text-center transition-all relative ${active ? "border-[#7B2FD6] bg-[#F8F5FF] text-[#4B3F80] shadow-sm" : "border-[#E5E0F1] bg-[#FAFAFA] text-[#7B6BAA] hover:bg-white"}`}
                    >
                      <Icon size={18} className={active ? "text-[#D946EF]" : "text-[#9CA3AF]"} />
                      <span className="font-medium line-clamp-1">{source}</span>
                      {active && <Check size={12} className="text-[#7B2FD6] absolute top-1.5 right-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#1A1230] mb-4 flex items-center gap-2">
                <Target size={16} className="text-[#7B2FD6]" />
                Report Modules
              </h2>
              <div className="flex flex-col gap-2">
                {Object.entries(modules).map(([mod, active]) => (
                  <button 
                    key={mod} 
                    onClick={() => handleToggle(setModules, mod)}
                    className={`flex items-center gap-3 text-sm p-2.5 rounded-lg transition-colors border ${active ? "bg-[#F8F5FF] border-[#E5E0F1] text-[#1A1230] font-semibold" : "border-transparent text-[#7B6BAA] hover:bg-[#F4F2F9]"}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${active ? "bg-gradient-to-br from-[#7B2FD6] to-[#D946EF]" : "bg-[#E5E0F1]"}`}>
                      {active && <Check size={12} className="text-white" />}
                    </div>
                    {mod}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Export & Distribution moved to header */}
        </div>

        {/* LIVE PREVIEW AREA */}
        <div className="flex-1 p-8 overflow-y-auto flex justify-center items-start">
          
          <div className="w-full max-w-[850px] bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(123,47,214,0.08)] border border-[#E5E0F1] relative" style={{ minHeight: "1100px", padding: "4rem" }}>
            
            {/* Watermark */}
            {watermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] overflow-hidden">
                <span className="text-[150px] font-bold uppercase rotate-[-45deg] tracking-widest text-[#1A1230]">CONFIDENTIAL</span>
              </div>
            )}

            {/* Document Header */}
            <div className="border-b-2 border-[#1A1230] pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1A1230] tracking-tight mb-2">{reportTitle}</h1>
                <p className="text-sm font-semibold text-[#7B2FD6] uppercase tracking-wider">
                  {reportType === "Custom" && customStart && customEnd ? `${customStart} to ${customEnd}` : `${reportType} Analysis`}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${confidentiality === "Public" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {confidentiality}
                </p>
                <p className="text-sm text-[#4B3F80] font-medium">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-xs text-[#7B6BAA] mt-1">Prepared by: {author}</p>
              </div>
            </div>

            <div className="text-[#1A1230] leading-relaxed space-y-10 relative z-10">
              
              {/* Module: Executive Summary */}
              {modules["Executive Summary"] && (
                <section>
                  <h2 className="text-lg font-bold border-b border-[#E5E0F1] pb-2 mb-4 text-[#1A1230] flex items-center gap-2">
                    <span className="w-2 h-6 rounded-full bg-[#7B2FD6]"></span>
                    Executive Summary
                  </h2>
                  <p className="text-base text-[#4B3F80] mb-4">
                    This document summarizes the intelligence gathered during the specified time period. Analysis indicates dynamic shifts across monitored topics. The prominent issue identified is <strong>"{issues[0]?.label}"</strong>, currently recording a severity index of {issues[0]?.score}. Public sentiment remains segmented, with positive engagement largely driven by digital media channels.
                  </p>
                  <p className="text-base text-[#4B3F80]">
                    Data aggregation for this brief included telemetry from {Object.entries(sources).filter(([_, v]) => v).map(([k]) => k).join(", ")}. Systems report stable data ingestion with zero critical SLA breaches during the recording period.
                  </p>
                </section>
              )}

              {/* Module: Sentiment Analysis */}
              {modules["Sentiment Analysis"] && (
                <section>
                  <h2 className="text-lg font-bold border-b border-[#E5E0F1] pb-2 mb-6 text-[#1A1230] flex items-center gap-2">
                    <span className="w-2 h-6 rounded-full bg-[#D946EF]"></span>
                    Sentiment Analysis
                  </h2>
                  <div className="flex items-center gap-10">
                    <div className="w-1/3">
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={sentimentData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" cornerRadius={4}>
                              {sentimentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(val: number) => `${val}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="w-2/3">
                      <div className="bg-[#F8F5FF] rounded-3xl p-6 p-4 border border-[#E5E0F1]">
                        <table className="w-full text-base border-collapse">
                          <thead>
                            <tr className="border-b border-[#E5E0F1] text-left text-[#7B6BAA]">
                              <th className="py-2 font-semibold">Classification</th>
                              <th className="py-2 font-semibold text-right">Volume</th>
                              <th className="py-2 font-semibold text-right">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sentimentData.map(s => (
                              <tr key={s.name} className="border-b border-[#E5E0F1] last:border-0">
                                <td className="py-3 font-semibold text-[#1A1230] flex items-center gap-3">
                                  <span className="w-3 h-3 rounded-full block shadow-sm" style={{ background: COLORS[s.name as keyof typeof COLORS] }}/>
                                  {s.name}
                                </td>
                                <td className="py-3 text-right font-bold text-[#1A1230]">{s.value}%</td>
                                <td className="py-3 text-right text-sm text-[#7B6BAA]">Stable</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Module: Top Issues */}
              {modules["Top 5 Issues"] && (
                <section>
                  <h2 className="text-lg font-bold border-b border-[#E5E0F1] pb-2 mb-6 text-[#1A1230] flex items-center gap-2">
                    <span className="w-2 h-6 rounded-full bg-[#0891B2]"></span>
                    Top 5 Issues Tracker
                  </h2>
                  <div className="bg-[#FAFAFA] rounded-3xl p-6 p-6 border border-[#E5E0F1] mb-4">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7B6BAA' }} tickLine={false} axisLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#7B6BAA' }} tickLine={false} axisLine={false} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#7B6BAA' }} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{ fill: '#F4F2F9' }} contentStyle={{ fontSize: '14px', border: '1px solid #E5E0F1', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                          <Bar yAxisId="left" dataKey="Index" fill="#7B2FD6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                          <Bar yAxisId="right" dataKey="Mentions" fill="#D946EF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <p className="text-base text-[#4B3F80]">
                    The graph above delineates the primary issues tracked during the period. The Severity Index (Purple) correlates closely with raw mention volume (Pink), indicating significant focus on the top 2 subjects.
                  </p>
                </section>
              )}

              {/* Module: Other placeholder modules */}
              {Object.keys(modules).filter(k => !["Executive Summary", "Sentiment Analysis", "Top 5 Issues"].includes(k) && modules[k]).map((mod, i) => (
                <section key={mod}>
                  <h2 className="text-lg font-bold border-b border-[#E5E0F1] pb-2 mb-4 text-[#1A1230] flex items-center gap-2">
                    <span className="w-2 h-6 rounded-full bg-gray-300"></span>
                    {mod}
                  </h2>
                  <div className="border border-dashed border-[#E5E0F1] p-6 bg-[#FAFAFA] rounded-3xl p-6 text-center">
                    <p className="text-base text-[#7B6BAA] font-medium">Data visualization for {mod} will be compiled in the final export.</p>
                  </div>
                </section>
              ))}

            </div>

            {/* Footer */}
            <div className="absolute bottom-[2rem] left-[4rem] right-[4rem] border-t border-[#E5E0F1] pt-4 flex justify-between items-center text-xs font-semibold text-[#9CA3AF]">
              <span>TEKNOVRA SMART DASHBOARD</span>
              <span>PAGE 1 OF 1</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
