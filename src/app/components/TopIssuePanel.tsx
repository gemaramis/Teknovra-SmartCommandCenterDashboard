import { TrendingUp, TrendingDown } from "lucide-react";
import { useLiveData } from "../contexts/LiveDataContext";

export function TopIssuePanel() {
  const { issues } = useLiveData();

  // Get Top 5 sorted by score descending
  const top5 = [...issues].sort((a, b) => b.score - a.score).slice(0, 5);
  const maxScore = Math.max(...top5.map((i) => i.score), 1);

  return (
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <span className="text-xs font-semibold tracking-wider text-[#6E6791]">TOP 5 ISSUES</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
          <span className="text-[0.7rem] font-medium text-[#059669]">HEALTHY</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto min-h-0 pr-1 pb-1">
        {top5.map((iss, index) => {
          const percentage = (iss.score / maxScore) * 100;
          const rank = index + 1;

          return (
            <div
              key={iss.label}
              className="flex items-center gap-3 p-1 rounded-lg transition-colors hover:bg-[#F7F6FA]"
            >
              {/* Rank Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6875rem] font-semibold flex-shrink-0 ${
                  rank === 1 ? "bg-[#7B2FD6] text-white" : "bg-[#F1EFF6] text-[#6E6791]"
                }`}
              >
                {rank}
              </div>

              {/* Content area */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Text and stats */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.85rem] font-medium text-[#191233] truncate">
                    {iss.label}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[0.85rem] font-semibold text-[#191233]">
                      {iss.score}
                    </span>
                    <span className="text-[0.65rem] text-[#9C96B5]">mentions</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      {iss.up ? (
                        <TrendingUp size={10} className="text-[#059669]" />
                      ) : (
                        <TrendingDown size={10} className="text-[#DC2626]" />
                      )}
                      <span
                        className={`text-[0.625rem] font-medium ${iss.up ? "text-[#059669]" : "text-[#DC2626]"}`}
                      >
                        {iss.change}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Bar */}
                <div className="w-full h-1 rounded-full bg-[#F1EFF6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7B2FD6] transition-all duration-500"
                    style={{ width: `${percentage}%`, opacity: rank === 1 ? 1 : 0.45 }}
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
