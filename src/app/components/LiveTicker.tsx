import { useMockData } from "../contexts/MockDataContext";
export function LiveTicker() {
  const { tickerItems } = useMockData();
  const loopedItems = [...tickerItems, ...tickerItems];

  return (
    <div
      className="h-9 flex items-center overflow-hidden"
      style={{ background: "#fff", borderTop: "1px solid rgba(123,47,214,0.15)" }}
    >
      <div
        className="flex-shrink-0 h-full flex items-center px-3"
        style={{ background: "linear-gradient(135deg, #7B2FD6, #D946EF)", minWidth: "80px" }}
      >
        <span style={{ color: "#fff", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em" }}>● LIVE</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-8 whitespace-nowrap"
          style={{ animation: "ticker-scroll 45s linear infinite", width: "max-content" }}
        >
          {loopedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span
                className="rounded px-1.5 py-0.5"
                style={{ background: `${item.color}18`, color: item.color, fontSize: "0.5625rem", fontWeight: 700 }}
              >
                {item.tag}
              </span>
              <span style={{ color: "#4B3F80", fontSize: "0.6875rem" }}>{item.text}</span>
              <span style={{ color: "#C9BAF0", marginLeft: "0.5rem" }}>·</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
