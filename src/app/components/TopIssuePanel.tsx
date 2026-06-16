import { TrendingUp, TrendingDown } from "lucide-react";
import { useMockData } from "../contexts/MockDataContext";

export function TopIssuePanel() {
  const { issues } = useMockData();

  // Get Top 5 sorted by score descending
  const top5 = [...issues].sort((a, b) => b.score - a.score).slice(0, 5);
  const maxScore = Math.max(...top5.map((i) => i.score), 1);

  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.5)", boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)" }}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <span style={{ color: "#1A1230", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em" }}>TOP 5 ISSUES</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#059669" }} />
          <span style={{ color: "#059669", fontSize: "0.85rem", fontWeight: 600 }}>HEALTHY</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto min-h-0 pr-1 pb-1">
        {top5.map((iss, index) => {
          const percentage = (iss.score / maxScore) * 100;
          const rank = index + 1;
          
          // Style rank badge based on position
          let rankBg = "#EDE8F9";
          let rankColor = "#7B6BAA";
          if (rank === 1) {
            rankBg = "linear-gradient(135deg, #7B2FD6, #D946EF)";
            rankColor = "#FFFFFF";
          } else if (rank === 2 || rank === 3) {
            rankBg = "#C9BAF0";
            rankColor = "#1A1230";
          }

          return (
            <div
              key={iss.label}
              className="flex items-center gap-3 p-1 rounded-lg transition-all hover:bg-[#F4F2F9]"
            >
              {/* Rank Badge */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[0.6875rem] font-bold flex-shrink-0"
                style={{ background: rankBg, color: rankColor }}
              >
                {rank}
              </div>

              {/* Content area */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Text and stats */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 600 }}
                    className="truncate"
                  >
                    {iss.label}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 700 }}>
                      {iss.score}
                    </span>
                    <span style={{ color: "#7B6BAA", fontSize: "0.65rem" }}>mentions</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      {iss.up ? (
                        <TrendingUp size={10} style={{ color: "#059669" }} />
                      ) : (
                        <TrendingDown size={10} style={{ color: "#EF4444" }} />
                      )}
                      <span style={{ color: iss.up ? "#059669" : "#EF4444", fontSize: "0.625rem", fontWeight: 600 }}>
                        {iss.change}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="w-full h-1.5 rounded-full bg-[#EDE8F9] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      background: "linear-gradient(90deg, #7B2FD6, #D946EF)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
