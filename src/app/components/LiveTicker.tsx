import { useLiveData } from "../contexts/LiveDataContext";
export function LiveTicker() {
  const { tickerItems } = useLiveData();
  const loopedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="h-9 flex items-center overflow-hidden bg-white border-t border-[#E7E4EF]">
      <div className="flex-shrink-0 h-full flex items-center px-3 bg-[#7B2FD6]" style={{ minWidth: "80px" }}>
        <span className="text-white text-[0.625rem] font-semibold tracking-[0.1em]">● LIVE</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          className="ticker-track flex items-center gap-8 whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {loopedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span
                className="rounded px-1.5 py-0.5"
                style={{ background: `${item.color}14`, color: item.color, fontSize: "0.65rem", fontWeight: 600 }}
              >
                {item.tag}
              </span>
              <span className="text-[0.8rem] text-[#443C66]">{item.text}</span>
              <span className="text-[#D8D3E6] ml-2">·</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ticker-track { animation: ticker-scroll 45s linear infinite; }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
