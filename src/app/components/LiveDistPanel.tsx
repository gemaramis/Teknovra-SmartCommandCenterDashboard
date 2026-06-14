import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";
export function LiveDistPanel() {
  const { sentimentData } = useMockData();
  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ background: "#fff", border: "1px solid rgba(123,47,214,0.12)", boxShadow: "0 2px 12px rgba(123,47,214,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D97706" }} />
          <span style={{ color: "#1A1230", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.05em" }}>LIVE DIST.</span>
        </div>
        <button
          onClick={() => toast.success("Live stream synchronized!")}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-opacity hover:opacity-80"
          style={{ background: "rgba(217,70,239,0.1)", color: "#D946EF", border: "1px solid rgba(217,70,239,0.3)" }}
        >
          + LIVE
        </button>
      </div>

      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={sentimentData} cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" dataKey="value" strokeWidth={0}>
              {sentimentData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(123,47,214,0.2)", borderRadius: "8px", fontSize: "12px", color: "#1A1230" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ color: "#7B6BAA", fontSize: "0.6rem", letterSpacing: "0.1em" }}>SENTIMENT</span>
        </div>
      </div>

      <div className="flex justify-between mb-3 mt-2">
        {sentimentData.map((s) => {
          const total = sentimentData.reduce((acc, curr) => acc + curr.value, 0);
          const percent = Math.round((s.value / total) * 100);
          return (
            <div key={s.name} className="flex flex-col items-center gap-0.5">
              <span style={{ color: s.color, fontSize: "1.125rem", fontWeight: 700 }}>
                {s.value} <span style={{ fontSize: "0.6875rem", fontWeight: 600, opacity: 0.8 }}>({percent}%)</span>
              </span>
              <span style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{s.name.toUpperCase()}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-2.5" style={{ background: "#F4F2F9" }}>
          <div style={{ color: "#7B6BAA", fontSize: "0.625rem", letterSpacing: "0.08em" }}>SLA WATCH</div>
          <div style={{ color: "#1A1230", fontSize: "1.25rem", fontWeight: 700 }}>26:55</div>
          <div style={{ color: "#EF4444", fontSize: "0.6rem" }}>DEADLINE APPROACHING</div>
          <div style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>Avg: 12m</div>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: "#F4F2F9" }}>
          <div style={{ color: "#7B6BAA", fontSize: "0.625rem", letterSpacing: "0.08em" }}>TIERING</div>
          <div style={{ color: "#1A1230", fontSize: "1.25rem", fontWeight: 700 }}>82%</div>
          <div style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>TIER 1 FOCUS</div>
          <div style={{ color: "#059669", fontSize: "0.6rem" }}>-2.4%</div>
        </div>
      </div>
    </div>
  );
}
