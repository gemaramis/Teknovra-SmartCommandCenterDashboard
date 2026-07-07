import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";
export function LiveDistPanel() {
  const { sentimentData, alerts } = useLiveData();
  const totalNegativeAlerts = alerts.length;
  return (
    <div className="rounded-3xl p-4 flex flex-col h-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)", boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D97706" }} />
          <span style={{ color: "#1A1230", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}>LIVE DIST.</span>
        </div>
      </div>

      <div className="flex-1 min-h-[100px] relative flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={sentimentData} cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" dataKey="value" strokeWidth={0}>
              {sentimentData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(123,47,214,0.2)", borderRadius: "8px", fontSize: "12px", color: "#1A1230" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ color: "#7B6BAA", fontSize: "0.6rem", letterSpacing: "0.1em" }}>SENTIMENT</span>
        </div>
      </div>

      <div className="flex justify-between mb-3 mt-2">
        {sentimentData.map((s) => {
          const total = sentimentData.reduce((acc, curr) => acc + curr.value, 0);
          const percent = total > 0 ? Math.round((s.value / total) * 100) : 0;
          return (
            <div key={s.name} className="flex flex-col items-center gap-0.5">
              <span style={{ color: s.color, fontSize: "1.25rem", fontWeight: 700 }}>
                {s.value} <span style={{ fontSize: "0.85rem", fontWeight: 600, opacity: 0.8 }}>({percent}%)</span>
              </span>
              <span style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{s.name.toUpperCase()}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl p-2.5 flex flex-col justify-between" style={{ background: "#F4F2F9" }}>
          <div style={{ color: "#7B6BAA", fontSize: "0.625rem", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>CRISIS MONITORING</div>
          <div className="flex gap-2 items-center flex-1">
            <div className="w-1.5 h-[32px] bg-gray-200 rounded-full flex flex-col justify-end overflow-hidden">
              <div className="w-full h-[85%] bg-red-500 rounded-full" />
            </div>
            <div>
              <div style={{ color: "#1A1230", fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 }}>DANGER</div>
              <div style={{ color: "#EF4444", fontSize: "0.55rem", fontWeight: 700, marginTop: "2px" }}>LEVEL 4 ALERT</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-2.5 flex flex-col justify-between" style={{ background: "#F4F2F9" }}>
          <div style={{ color: "#7B6BAA", fontSize: "0.625rem", letterSpacing: "0.08em" }}>NEGATIVE ISSUES</div>
          <div>
            <div style={{ color: "#1A1230", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>{totalNegativeAlerts}</div>
            <div style={{ color: "#EF4444", fontSize: "0.6rem", fontWeight: 600, marginTop: "2px" }}>ACTIVE ALERTS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
