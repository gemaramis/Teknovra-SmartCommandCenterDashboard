import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useLiveData } from "../contexts/LiveDataContext";
const COLORS: string[] = [
  "#7B2FD6",
  "#2563EB",
  "#0D9488",
  "#D97706",
  "#64748B",
];

const issueDetails: Record<string, { summary: string; sentiment: string; topMedia: string; volume: number; trend: string }> = {
  Prabowo: {
    summary: "Isu terkait kebijakan Presiden Prabowo mendominasi perbincangan publik, terutama terkait program ekonomi dan kebijakan luar negeri.",
    sentiment: "62% Negatif · 28% Positif · 10% Netral",
    topMedia: "Kompas, Detik, CNN Indonesia",
    volume: 4280,
    trend: "+14.2%",
  },
  MBG: {
    summary: "Program Makan Bergizi Gratis memicu debat publik soal efektivitas anggaran dan distribusi manfaat kepada masyarakat.",
    sentiment: "48% Negatif · 35% Positif · 17% Netral",
    topMedia: "Tempo, CNBC Indonesia, Bisnis.com",
    volume: 2810,
    trend: "+20.8%",
  },
  Danantara: {
    summary: "Isu tata kelola dan transparansi Danantara menjadi sorotan media, khususnya terkait alokasi investasi sovereign wealth fund.",
    sentiment: "71% Negatif · 19% Positif · 10% Netral",
    topMedia: "Bloomberg Indonesia, Reuters, Antara",
    volume: 1960,
    trend: "+8.6%",
  },
  Gemoy: {
    summary: "Fenomena Gemoy dalam narasi politik terus menjadi topik diskusi di media sosial terkait gaya komunikasi pemimpin.",
    sentiment: "35% Negatif · 50% Positif · 15% Netral",
    topMedia: "Twitter/X, TikTok, Instagram",
    volume: 1540,
    trend: "+4.1%",
  },
  Gerindra: {
    summary: "Partai Gerindra menghadapi sorotan terkait konsolidasi internal dan posisi koalisi menjelang evaluasi pemerintahan.",
    sentiment: "55% Negatif · 30% Positif · 15% Netral",
    topMedia: "Republika, Media Indonesia, Tribun",
    volume: 2120,
    trend: "+10.5%",
  },
};

function DetailModal({ issue, color, onClose }: { issue: string; color: string; onClose: () => void }) {
  const d = issueDetails[issue];
  if (!d) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(25,18,51,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E7E4EF] rounded-xl p-6 w-[480px] max-w-full shadow-[0_16px_48px_rgba(23,15,46,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-base font-semibold text-[#191233]">{issue}</span>
          </div>
          <button onClick={onClose} className="text-[#9C96B5] text-2xl leading-none hover:text-[#191233] transition-colors">×</button>
        </div>
        <p className="text-[0.9rem] leading-relaxed text-[#443C66] mb-4">{d.summary}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 bg-[#F7F6FA]">
            <div className="text-[0.7rem] text-[#9C96B5]">VOLUME MENTION</div>
            <div className="text-[1.375rem] font-semibold text-[#191233]">{d.volume.toLocaleString()}</div>
            <div className="text-[0.75rem] text-[#059669]">{d.trend} vs bulan lalu</div>
          </div>
          <div className="rounded-lg p-3 bg-[#F7F6FA]">
            <div className="text-[0.7rem] text-[#9C96B5]">SENTIMEN</div>
            <div className="text-[0.8rem] leading-relaxed text-[#191233] mt-1">{d.sentiment}</div>
          </div>
          <div className="rounded-lg p-3 col-span-2 bg-[#F7F6FA]">
            <div className="text-[0.7rem] text-[#9C96B5]">TOP MEDIA</div>
            <div className="text-[0.85rem] text-[#191233] mt-1">{d.topMedia}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-[#7B2FD6] hover:bg-[#6A28BC] text-white text-[0.85rem] font-semibold transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white border border-[#E7E4EF] rounded-lg p-3 shadow-[0_4px_12px_rgba(23,15,46,0.08)] text-[0.8rem]">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: data.payload.color || data.color }} />
        <span className="font-semibold text-[#191233]">{label}</span>
        <span className="font-semibold text-[#7B2FD6] ml-auto">{data.value} Vol Index</span>
      </div>
    </div>
  );
};

export function IssueBenchmark() {
  const { issues } = useLiveData();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // Transform top 5 issues to chart data
  const chartData = issues.slice(0, 5).map((iss, idx) => ({
    name: iss.topic,
    value: iss.score || 0,
    color: COLORS[idx % COLORS.length],
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-start justify-between mb-2 flex-shrink-0">
        <div>
          <div className="text-xs font-semibold tracking-wider text-[#6E6791]">ISSUE BENCHMARK</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[1.75rem] font-semibold tracking-tight text-[#191233]">{chartData[0]?.value || 0}</span>
            <span className="text-[0.8rem] text-[#9C96B5]">Max Vol Index</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
          {chartData.map(({ name, color, value }) => (
            <button
              key={name}
              onClick={() => setSelectedIssue(name)}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[0.8rem] text-[#443C66]">{name}</span>
              <span className="text-[0.8rem] font-semibold text-[#191233]">{value}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEDF5" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#9C96B5", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#6E6791", fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F7F6FA" }} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              onClick={(entry: any) => setSelectedIssue(entry.name)}
              style={{ cursor: "pointer" }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[0.8rem] text-[#6E6791] mt-2">
        {chartData[0]?.name || 'Issue'} memimpin volume isu sementara mencatat kenaikan tertinggi.{" "}
        <span className="text-[#7B2FD6] cursor-pointer font-medium">Klik isu untuk detail →</span>
      </div>

      {selectedIssue && <DetailModal issue={selectedIssue} color={chartData.find(c => c.name === selectedIssue)?.color || "#7B2FD6"} onClose={() => setSelectedIssue(null)} />}
    </div>
  );
}
