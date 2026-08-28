import React, { useState } from "react";
import { AlertTriangle, Clock, TrendingUp, Zap, ShieldAlert, Bot } from "lucide-react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";
const levelColor: Record<string, string> = { HIGH: "#DC2626", MED: "#D97706", LOW: "#059669" };

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
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-[#6E6791]">ALERT NEGATIVE ISSUE</span>
        <span className="rounded px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] text-[0.7rem] font-semibold">HIGH</span>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg p-3 bg-[#F7F6FA] border border-[#E7E4EF]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1 h-8 rounded-full" style={{ background: levelColor[alert.level] }} />
              <div>
                <div className="text-[0.85rem] font-semibold text-[#191233]">{alert.title}</div>
                <div className="text-[0.625rem] text-[#9C96B5]">{alert.source}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1 text-[0.625rem] text-[#9C96B5]">
                  <Clock size={9} /> TIME LEFT
                </div>
                <div className="text-[1.15rem] font-semibold text-[#191233]">{alert.timeLeft}</div>
                <div className="text-[0.6rem] text-[#9C96B5]">{alert.remaining}</div>
              </div>
              <div>
                <div className="text-[0.625rem] text-[#9C96B5]">ISSUE TYPE</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <AlertTriangle size={10} className="text-[#D97706]" />
                  <span className="text-[0.8rem] text-[#191233]">{alert.issueType}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp size={10} className="text-[#DC2626]" />
                  <span className="text-[0.8rem] text-[#DC2626]">{alert.impact}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-2.5">
              <div>
                <div className="text-[0.625rem] text-[#9C96B5]">Mentions</div>
                <div className="text-[0.95rem] font-semibold text-[#191233]">{alert.mentions}</div>
                <div className="text-[0.6rem] text-[#9C96B5]">{alert.mentionLabel}</div>
              </div>
              <div>
                <div className="text-[0.625rem] text-[#9C96B5]">Top Channel</div>
                <div className="text-[0.8rem] font-medium text-[#191233]">{alert.topChannel}</div>
              </div>
              <div>
                <div className="text-[0.625rem] text-[#9C96B5]">System Health</div>
                <div className="text-[0.8rem] text-[#059669]">{alert.systemHealth}</div>
              </div>
            </div>

            <button
              onClick={() => handleActNow(alert.id.toString())}
              className="w-full py-1.5 rounded-lg flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[0.8rem] font-semibold transition-colors"
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
          <div className="grid grid-cols-2 gap-3 py-4">
            <button
              onClick={() => navigate(`/escalation/${selectedIssueId}`)}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-[#E7E4EF] bg-white hover:border-[#DC2626] transition-colors group"
            >
              <ShieldAlert className="w-8 h-8 text-[#DC2626]" />
              <div className="text-center">
                <div className="font-semibold text-[#191233] mb-1">Escalation</div>
                <div className="text-xs text-[#6E6791]">Route to human response teams</div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/ai-response/${selectedIssueId}`)}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-[#E7E4EF] bg-white hover:border-[#7B2FD6] transition-colors group"
            >
              <Bot className="w-8 h-8 text-[#7B2FD6]" />
              <div className="text-center">
                <div className="font-semibold text-[#191233] mb-1">AI Response</div>
                <div className="text-xs text-[#6E6791]">Generate content countermeasures</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
