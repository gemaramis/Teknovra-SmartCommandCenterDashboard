import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useLiveData } from "../contexts/LiveDataContext";
export function LiveDistPanel() {
  const { sentimentData, alerts } = useLiveData();
  const totalNegativeAlerts = alerts.length;
  return (
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span className="text-xs font-semibold tracking-wider text-[#6E6791]">LIVE DIST.</span>
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
            <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E7E4EF", borderRadius: "8px", fontSize: "12px", color: "#191233", boxShadow: "0 4px 12px rgba(23,15,46,0.08)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[0.6rem] tracking-[0.1em] text-[#9C96B5]">SENTIMENT</span>
        </div>
      </div>

      <div className="flex justify-between mb-3 mt-2">
        {sentimentData.map((s) => {
          const total = sentimentData.reduce((acc, curr) => acc + curr.value, 0);
          const percent = total > 0 ? Math.round((s.value / total) * 100) : 0;
          return (
            <div key={s.name} className="flex flex-col items-center gap-0.5">
              <span style={{ color: s.color, fontSize: "1.15rem", fontWeight: 600 }}>
                {s.value} <span style={{ fontSize: "0.75rem", fontWeight: 500, opacity: 0.75 }}>({percent}%)</span>
              </span>
              <span className="text-[0.625rem] text-[#9C96B5]">{s.name.toUpperCase()}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-2.5 flex flex-col justify-between bg-[#F7F6FA]">
          <div className="text-[0.625rem] tracking-wider text-[#9C96B5] mb-1">CRISIS MONITORING</div>
          <div className="flex gap-2 items-center flex-1">
            <div className="w-1.5 h-[32px] bg-[#E7E4EF] rounded-full flex flex-col justify-end overflow-hidden">
              <div className="w-full h-[85%] bg-[#DC2626] rounded-full" />
            </div>
            <div>
              <div className="text-[1rem] font-semibold text-[#191233] leading-none">DANGER</div>
              <div className="text-[0.55rem] font-semibold text-[#DC2626] mt-0.5">LEVEL 4 ALERT</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg p-2.5 flex flex-col justify-between bg-[#F7F6FA]">
          <div className="text-[0.625rem] tracking-wider text-[#9C96B5]">NEGATIVE ISSUES</div>
          <div>
            <div className="text-[1.75rem] font-semibold text-[#191233] leading-none">{totalNegativeAlerts}</div>
            <div className="text-[0.6rem] font-medium text-[#DC2626] mt-0.5">ACTIVE ALERTS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
