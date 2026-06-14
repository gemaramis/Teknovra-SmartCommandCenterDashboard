import { TrendingUp, TrendingDown } from "lucide-react";
import { useMockData } from "../contexts/MockDataContext";
export function TopIssuePanel() {
  const { issues } = useMockData();
  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ background: "#fff", border: "1px solid rgba(123,47,214,0.12)", boxShadow: "0 2px 12px rgba(123,47,214,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#1A1230", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.05em" }}>TOP ISSUE</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#059669" }} />
          <span style={{ color: "#059669", fontSize: "0.6875rem" }}>HEALTHY</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto min-h-0 pr-1 pb-1">
        {issues.map((iss) => (
          <div
            key={iss.label}
            className="rounded-xl p-2.5 cursor-pointer transition-all hover:shadow-md"
            style={{ background: "#F4F2F9", border: "1px solid rgba(123,47,214,0.1)" }}
          >
            <div style={{ color: "#7B6BAA", fontSize: "0.625rem", marginBottom: "0.25rem" }} className="truncate">{iss.label}</div>
            <div style={{ color: "#1A1230", fontSize: "1.25rem", fontWeight: 700 }}>{iss.score}</div>
            <div className="flex items-center gap-0.5 mt-0.5">
              {iss.up
                ? <TrendingUp size={10} style={{ color: "#059669" }} />
                : <TrendingDown size={10} style={{ color: "#EF4444" }} />}
              <span style={{ color: iss.up ? "#059669" : "#EF4444", fontSize: "0.6875rem" }}>{iss.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
