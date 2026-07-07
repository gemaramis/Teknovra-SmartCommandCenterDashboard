import { useLiveData } from "../contexts/LiveDataContext";
const typeColor: Record<string, string> = {
  Online: "#7B2FD6",
  Social: "#D946EF",
  Cetak: "#0891B2",
  "TV/Radio": "#D97706",
};

export function ListMediaPanel() {
  const { mediaChannels: channels, mediaList } = useLiveData();
  return (
    <div className="rounded-3xl p-6 p-4 flex flex-col h-full" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)", boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#1A1230", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}>LIST MEDIA</span>
        <span style={{ color: "#059669", fontSize: "0.85rem", fontWeight: 700 }}>48% Online</span>
      </div>

      <div className="flex gap-2 mb-3">
        {channels.map((ch) => (
          <div key={ch.label} className="flex-1">
            <div className="flex justify-between mb-1">
              <span style={{ color: "#7B6BAA", fontSize: "0.6rem" }}>{ch.label}</span>
              <span style={{ color: "#1A1230", fontSize: "0.6rem", fontWeight: 600 }}>{ch.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#EDE8F9" }}>
              <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, background: ch.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-3 rounded-3xl p-6 p-2" style={{ background: "#F4F2F9" }}>
        {[["Nasional", "78%"], ["Lokal", "15%"], ["Intl", "7%"]].map(([label, val]) => (
          <div key={label} className="flex items-center gap-1">
            <span style={{ color: "#7B6BAA", fontSize: "0.85rem" }}>{label}</span>
            <span style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 700 }}>{val}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr>
              {["MEDIA", "TIPE", "MENTION", "REACH"].map((h, i) => (
                <th key={h} style={{ color: "#7B6BAA", fontSize: "0.625rem", textAlign: i >= 2 ? "right" : "left", paddingBottom: "0.5rem", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mediaList.map((m) => (
              <tr key={m.name} className="hover:bg-[#F4F2F9] transition-colors cursor-pointer">
                <td style={{ color: "#1A1230", fontSize: "0.85rem", paddingBottom: "0.375rem" }}>{m.name}</td>
                <td style={{ paddingBottom: "0.375rem" }}>
                  <span className="rounded px-1.5 py-0.5" style={{ background: `${typeColor[m.type]}18`, color: typeColor[m.type], fontSize: "0.65rem", fontWeight: 600 }}>
                    {m.type}
                  </span>
                </td>
                <td style={{ color: "#D946EF", fontSize: "0.85rem", textAlign: "right", fontWeight: 700, paddingBottom: "0.375rem" }}>
                  {m.mentions.toLocaleString()}
                </td>
                <td style={{ color: "#7B6BAA", fontSize: "0.85rem", textAlign: "right", paddingBottom: "0.375rem" }}>
                  {m.reach}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
