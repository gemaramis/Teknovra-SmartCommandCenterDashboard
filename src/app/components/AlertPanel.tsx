import React, { useState } from "react";
import { AlertTriangle, Clock, TrendingUp, Zap, ShieldAlert, Bot } from "lucide-react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";
const levelColor: Record<string, string> = { HIGH: "#EF4444", MED: "#D97706", LOW: "#059669" };
const levelBg: Record<string, string> = { HIGH: "rgba(239,68,68,0.08)", MED: "rgba(217,119,6,0.08)", LOW: "rgba(5,150,105,0.08)" };

export function AlertPanel() {
  const { alerts } = useLiveData();
  const navigate = useNavigate();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleActNow = (id: string) => {
    setSelectedIssueId(id);
    setIsDialogOpen(true);
  };

  return (
    <div className="rounded-3xl p-6 p-4 flex flex-col h-full" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 2px 12px rgba(239,68,68,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#1A1230", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}>ALERT NEGATIVE ISSUE</span>
        <span className="rounded px-2 py-0.5" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "0.85rem", fontWeight: 700 }}>HIGH</span>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-3xl p-6 p-3" style={{ background: levelBg[alert.level], border: `1px solid ${levelColor[alert.level]}33` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-8 rounded-full" style={{ background: levelColor[alert.level] }} />
              <div>
                <div style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 600 }}>{alert.title}</div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{alert.source}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1" style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>
                  <Clock size={9} /> TIME LEFT
                </div>
                <div style={{ color: "#1A1230", fontSize: "1.25rem", fontWeight: 700 }}>{alert.timeLeft}</div>
                <div style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>{alert.remaining}</div>
              </div>
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>ISSUE TYPE</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <AlertTriangle size={10} style={{ color: "#D97706" }} />
                  <span style={{ color: "#1A1230", fontSize: "0.85rem" }}>{alert.issueType}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp size={10} style={{ color: "#EF4444" }} />
                  <span style={{ color: "#EF4444", fontSize: "0.85rem" }}>{alert.impact}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>Mentions</div>
                <div style={{ color: "#1A1230", fontSize: "1rem", fontWeight: 700 }}>{alert.mentions}</div>
                <div style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>{alert.mentionLabel}</div>
              </div>
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>Top Channel</div>
                <div style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 600 }}>{alert.topChannel}</div>
              </div>
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>System Health</div>
                <div style={{ color: "#059669", fontSize: "0.85rem" }}>{alert.systemHealth}</div>
              </div>
            </div>

            <button
              onClick={() => handleActNow(alert.id.toString())}
              className="w-full py-1.5 rounded-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "#EF4444", color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}
            >
              <Zap size={12} /> ACT NOW
            </button>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Action Pathway Required</DialogTitle>
            <DialogDescription>
              How would you like to handle this critical issue?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => navigate(`/escalation/${selectedIssueId}`)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl p-6 border-2 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all group"
            >
              <ShieldAlert className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-bold text-red-900 mb-1">Escalation</div>
                <div className="text-sm text-red-600/80">Route to human response teams</div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/ai-response/${selectedIssueId}`)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl p-6 border-2 border-purple-100 bg-purple-50 hover:bg-purple-100 hover:border-purple-200 transition-all group"
            >
              <Bot className="w-10 h-10 text-purple-500 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="font-bold text-purple-900 mb-1">AI Response</div>
                <div className="text-sm text-purple-600/80">Generate content countermeasures</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
