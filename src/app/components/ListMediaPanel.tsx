import { useLiveData } from "../contexts/LiveDataContext";
const typeColor: Record<string, string> = {
  Online: "#7B2FD6",
  Social: "#2563EB",
  Cetak: "#0D9488",
  "TV/Radio": "#D97706",
};

export function ListMediaPanel() {
  const { mediaChannels: channels, mediaList } = useLiveData();
  return (
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-[#6E6791]">LIST MEDIA</span>
        <span className="text-[0.8rem] font-semibold text-[#059669]">48% Online</span>
      </div>

      <div className="flex gap-2 mb-3">
        {channels.map((ch) => (
          <div key={ch.label} className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[0.6rem] text-[#9C96B5]">{ch.label}</span>
              <span className="text-[0.6rem] font-medium text-[#191233]">{ch.pct}%</span>
            </div>
            <div className="h-1 rounded-full bg-[#F1EFF6]">
              <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, background: ch.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-3 rounded-lg px-3 py-2 bg-[#F7F6FA]">
        {[["Nasional", "78%"], ["Lokal", "15%"], ["Intl", "7%"]].map(([label, val]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-[0.75rem] text-[#6E6791]">{label}</span>
            <span className="text-[0.75rem] font-semibold text-[#191233]">{val}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr>
              {["MEDIA", "TIPE", "MENTION", "REACH"].map((h, i) => (
                <th key={h} className="text-[0.625rem] font-medium text-[#9C96B5] pb-2" style={{ textAlign: i >= 2 ? "right" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mediaList.map((m) => (
              <tr key={m.name} className="hover:bg-[#F7F6FA] transition-colors cursor-pointer">
                <td className="text-[0.8rem] text-[#191233] pb-1.5">{m.name}</td>
                <td className="pb-1.5">
                  <span className="rounded px-1.5 py-0.5" style={{ background: `${typeColor[m.type]}12`, color: typeColor[m.type], fontSize: "0.65rem", fontWeight: 600 }}>
                    {m.type}
                  </span>
                </td>
                <td className="text-[0.8rem] font-semibold text-[#7B2FD6] text-right pb-1.5">
                  {m.mentions.toLocaleString()}
                </td>
                <td className="text-[0.8rem] text-[#6E6791] text-right pb-1.5">
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
