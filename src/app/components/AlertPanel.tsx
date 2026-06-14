import { AlertTriangle, Clock, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";
const levelColor: Record<string, string> = { HIGH: "#EF4444", MED: "#D97706", LOW: "#059669" };
const levelBg: Record<string, string> = { HIGH: "rgba(239,68,68,0.08)", MED: "rgba(217,119,6,0.08)", LOW: "rgba(5,150,105,0.08)" };

export function AlertPanel() {
  const { alerts } = useMockData();
  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ background: "#fff", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 2px 12px rgba(239,68,68,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#1A1230", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.05em" }}>ALERT ISSUE NEGATIVE</span>
        <span className="rounded px-2 py-0.5" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: "0.6875rem", fontWeight: 700 }}>HIGH</span>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-xl p-3" style={{ background: levelBg[alert.level], border: `1px solid ${levelColor[alert.level]}33` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-8 rounded-full" style={{ background: levelColor[alert.level] }} />
              <div>
                <div style={{ color: "#1A1230", fontSize: "0.75rem", fontWeight: 600 }}>{alert.title}</div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{alert.source}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1" style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>
                  <Clock size={9} /> TIME LEFT
                </div>
                <div style={{ color: "#1A1230", fontSize: "1.125rem", fontWeight: 700 }}>{alert.timeLeft}</div>
                <div style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>{alert.remaining}</div>
              </div>
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>ISSUE TYPE</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <AlertTriangle size={10} style={{ color: "#D97706" }} />
                  <span style={{ color: "#1A1230", fontSize: "0.6875rem" }}>{alert.issueType}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp size={10} style={{ color: "#EF4444" }} />
                  <span style={{ color: "#EF4444", fontSize: "0.6875rem" }}>{alert.impact}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>Mentions</div>
                <div style={{ color: "#1A1230", fontSize: "0.875rem", fontWeight: 700 }}>{alert.mentions}</div>
                <div style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>{alert.mentionLabel}</div>
              </div>
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>Top Channel</div>
                <div style={{ color: "#1A1230", fontSize: "0.75rem", fontWeight: 600 }}>{alert.topChannel}</div>
              </div>
              <div>
                <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>System Health</div>
                <div style={{ color: "#059669", fontSize: "0.75rem" }}>{alert.systemHealth}</div>
              </div>
            </div>

            <button
              onClick={() => toast.success(`Issue "${alert.title}" successfully escalated!`)}
              className="w-full py-1.5 rounded-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "#EF4444", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}
            >
              <Zap size={12} /> ESCALATE NOW
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
