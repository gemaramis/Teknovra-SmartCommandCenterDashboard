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

import { useMockData } from "../contexts/MockDataContext";
const COLORS: Record<string, string> = {
  Prabowo: "#7B2FD6",
  MBG: "#D946EF",
  Danantara: "#0891B2",
  Gemoy: "#D97706",
  Gerindra: "#059669",
};

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

function DetailModal({ issue, onClose }: { issue: string; onClose: () => void }) {
  const d = issueDetails[issue];
  if (!d) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(26,18,48,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-6 p-6 w-[480px] max-w-full shadow-2xl"
        style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(123,47,214,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[issue] }} />
            <span style={{ color: "#1A1230", fontWeight: 700, fontSize: "1rem" }}>{issue}</span>
          </div>
          <button onClick={onClose} style={{ color: "#7B6BAA", fontSize: "2rem", lineHeight: 1 }} className="hover:text-[#1A1230] transition-colors">×</button>
        </div>
        <p style={{ color: "#4B3F80", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem" }}>{d.summary}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl p-6 p-3" style={{ background: "#F4F2F9" }}>
            <div style={{ color: "#7B6BAA", fontSize: "0.85rem" }}>VOLUME MENTION</div>
            <div style={{ color: "#1A1230", fontSize: "1.375rem", fontWeight: 700 }}>{d.volume.toLocaleString()}</div>
            <div style={{ color: "#059669", fontSize: "0.85rem" }}>{d.trend} vs bulan lalu</div>
          </div>
          <div className="rounded-3xl p-6 p-3" style={{ background: "#F4F2F9" }}>
            <div style={{ color: "#7B6BAA", fontSize: "0.85rem" }}>SENTIMEN</div>
            <div style={{ color: "#1A1230", fontSize: "0.85rem", marginTop: "0.25rem", lineHeight: 1.6 }}>{d.sentiment}</div>
          </div>
          <div className="rounded-3xl p-6 p-3 col-span-2" style={{ background: "#F4F2F9" }}>
            <div style={{ color: "#7B6BAA", fontSize: "0.85rem" }}>TOP MEDIA</div>
            <div style={{ color: "#1A1230", fontSize: "0.9rem", marginTop: "0.25rem" }}>{d.topMedia}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-3xl p-6 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7B2FD6, #D946EF)", color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}
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
    <div className="rounded-3xl p-6 p-3 shadow-xl" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(123,47,214,0.2)", fontSize: "0.85rem" }}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: data.payload.color || data.color }} />
        <span style={{ color: "#1A1230", fontWeight: 700 }}>{label}</span>
        <span style={{ color: "#7B2FD6", fontWeight: 700, marginLeft: "auto" }}>{data.value} Vol Index</span>
      </div>
    </div>
  );
};

export function IssueBenchmark() {
  const { issueData } = useMockData();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const latestValues: any = issueData[issueData.length - 1] || {};

  // Transform latest values to sorted array from highest to lowest
  const chartData = Object.entries(COLORS)
    .map(([key, color]) => ({
      name: key,
      value: latestValues[key] || 0,
      color,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-3xl p-6 p-4 flex flex-col h-full" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)", boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)" }}>
      <div className="flex items-start justify-between mb-2 flex-shrink-0">
        <div>
          <div style={{ color: "#7B6BAA", fontSize: "0.85rem", letterSpacing: "0.08em" }}>ISSUE BENCHMARK</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span style={{ color: "#1A1230", fontSize: "2rem", fontWeight: 700 }}>{chartData[0]?.value || 0}</span>
            <span style={{ color: "#7B6BAA", fontSize: "0.85rem" }}>Max Vol Index</span>
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
              <span style={{ color: "#4B3F80", fontSize: "0.85rem" }}>{name}</span>
              <span style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 700 }}>{value}</span>
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(123,47,214,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#7B6BAA", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#7B6BAA", fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
            <Tooltip content={<CustomTooltip />} />
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

      <div style={{ color: "#7B6BAA", fontSize: "0.85rem", marginTop: "0.5rem" }}>
        Prabowo memimpin volume isu (+14.2%) sementara MBG mencatat kenaikan tertinggi bulan ini.{" "}
        <span style={{ color: "#7B2FD6", cursor: "pointer" }}>Klik isu untuk detail →</span>
      </div>

      {selectedIssue && <DetailModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
    </div>
  );
}
