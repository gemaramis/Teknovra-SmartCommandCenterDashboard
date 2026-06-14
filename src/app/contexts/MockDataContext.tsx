import React, { createContext, useContext, useEffect, useState } from "react";

export interface IssueDataPoint { month: string; Prabowo: number; MBG: number; Danantara: number; Gemoy: number; Gerindra: number; [key: string]: string | number; }
export interface AlertData { id: number; level: string; issueType: string; timeLeft: string; remaining: string; impact: string; title: string; source: string; mentions: string; mentionLabel: string; topChannel: string; systemHealth: string; }
export interface SentimentData { name: string; value: number; color: string; }
export interface SocialPost { rank: number; platform: string; time: string; content: string; user: string; likes: string; comments: string; sentiment: string; }
export interface IssueItem { label: string; score: number; change: string; up: boolean; }
export interface PersonItem { name: string; count: number; role: string; }
export interface MediaChannel { label: string; pct: number; color: string; }
export interface MediaItem { name: string; type: string; mentions: number; reach: string; }
export interface TickerItem { tag: string; color: string; text: string; }

export interface MockDataState {
  issueData: IssueDataPoint[];
  alerts: AlertData[];
  sentimentData: SentimentData[];
  posts: SocialPost[];
  issues: IssueItem[];
  persons: PersonItem[];
  mediaChannels: MediaChannel[];
  mediaList: MediaItem[];
  tickerItems: TickerItem[];
}

const initialMockState: MockDataState = {
  issueData: [
    { month: "Jan", Prabowo: 65, MBG: 42, Danantara: 38, Gemoy: 55, Gerindra: 48 },
    { month: "Feb", Prabowo: 72, MBG: 58, Danantara: 45, Gemoy: 49, Gerindra: 52 },
    { month: "Mar", Prabowo: 68, MBG: 75, Danantara: 62, Gemoy: 44, Gerindra: 58 },
    { month: "Apr", Prabowo: 85, MBG: 68, Danantara: 71, Gemoy: 38, Gerindra: 63 },
    { month: "Mei", Prabowo: 92, MBG: 72, Danantara: 58, Gemoy: 52, Gerindra: 71 },
    { month: "Jun", Prabowo: 106, MBG: 87, Danantara: 65, Gemoy: 61, Gerindra: 78 },
  ],
  alerts: [
    { id: 1, level: "HIGH", issueType: "Negative Sentiment", timeLeft: "5:37", remaining: "19% Remaining", impact: "High Exposure", title: "Prabowo Kebijakan Anggaran", source: "Twitter · Detected 20.30", mentions: "12.4K", mentionLabel: "Netral", topChannel: "Twitter/X", systemHealth: "99.9% Stable" },
    { id: 2, level: "MED", issueType: "Misinformasi Viral", timeLeft: "18:42", remaining: "55% Remaining", impact: "Medium Exposure", title: "Isu Dana MBG Bocor", source: "TikTok · Detected 19.15", mentions: "8.1K", mentionLabel: "Negatif", topChannel: "TikTok", systemHealth: "98.2% Stable" },
  ],
  sentimentData: [
    { name: "Negatif", value: 22, color: "#EF4444" },
    { name: "Positif", value: 38, color: "#7B2FD6" },
    { name: "Netral", value: 39, color: "#C9BAF0" },
  ],
  posts: [
    { rank: 1, platform: "Twitter/X", time: "2j lalu", content: "Kebijakan MBG Prabowo dipertanyakan: anggaran Rp 71 triliun, siapa yang benar-benar diuntungkan?", user: "@AnalisisID_2024", likes: "24.3K", comments: "1.8K", sentiment: "negative" },
    { rank: 2, platform: "TikTok", time: "3j lalu", content: "Danantara raih investasi baru Rp 50T dari mitra asing — tapi kenapa rakyat belum merasakan manfaatnya?", user: "@InfoEkonomi.id", likes: "18.7K", comments: "2.1K", sentiment: "negative" },
    { rank: 3, platform: "Instagram", time: "5j lalu", content: "Prabowo hadir di forum G7, disambut hangat pemimpin dunia. Citra Indonesia makin diperhitungkan.", user: "@BeritaNasional", likes: "12.1K", comments: "843", sentiment: "positive" },
  ],
  issues: [
    { label: "Korupsi Dana Bansos", score: 92, change: "+5.2%", up: true },
    { label: "Kebijakan MBG", score: 88, change: "+3.8%", up: true },
    { label: "Isu Danantara", score: 85, change: "+2.1%", up: true },
    { label: "Keamanan Nasional", score: 79, change: "+1.8%", up: true },
    { label: "Ekonomi & Inflasi", score: 74, change: "-0.6%", up: false },
    { label: "Reformasi Birokrasi", score: 68, change: "+0.4%", up: true },
  ],
  persons: [
    { name: "Prabowo Subianto", count: 245, role: "Presiden RI" },
    { name: "Joko Widodo", count: 182, role: "Mantan Presiden" },
    { name: "Anies Baswedan", count: 156, role: "Tokoh Oposisi" },
    { name: "Gibran Rakabuming", count: 128, role: "Wakil Presiden" },
    { name: "Megawati Soekarnoputri", count: 97, role: "Ketua Umum PDIP" },
    { name: "Sri Mulyani", count: 73, role: "Menteri Keuangan" },
    { name: "Luhut Binsar Pandjaitan", count: 64, role: "Menko Marves" },
  ],
  mediaChannels: [
    { label: "Online", pct: 48, color: "#7B2FD6" },
    { label: "Social", pct: 32, color: "#D946EF" },
    { label: "Cetak", pct: 12, color: "#0891B2" },
    { label: "TV/Radio", pct: 8, color: "#D97706" },
  ],
  mediaList: [
    { name: "Kompas.com", type: "Online", mentions: 1248, reach: "12.5M" },
    { name: "Detik.com", type: "Online", mentions: 987, reach: "9.8M" },
    { name: "Tempo.co", type: "Online", mentions: 743, reach: "7.2M" },
    { name: "CNN Indonesia", type: "Online", mentions: 621, reach: "6.1M" },
    { name: "Twitter/X", type: "Social", mentions: 4210, reach: "18.4M" },
    { name: "TikTok", type: "Social", mentions: 2875, reach: "22.1M" },
    { name: "Instagram", type: "Social", mentions: 1930, reach: "15.6M" },
    { name: "Kompas", type: "Cetak", mentions: 312, reach: "1.2M" },
    { name: "Metro TV", type: "TV/Radio", mentions: 198, reach: "8.4M" },
  ],
  tickerItems: [
    { tag: "LIVE FEED", color: "#7B2FD6", text: "Prabowo hadiri KTT ASEAN di Kuala Lumpur, bahas kerja sama pertahanan regional." },
    { tag: "BREAKING", color: "#EF4444", text: "Dana MBG diaudit BPK — temuan awal bocor ke media, pemerintah bantah." },
    { tag: "TRENDING", color: "#D946EF", text: "Tagar #DanantaraGagal trending #2 di Twitter/X dengan 420K tweet dalam 6 jam." },
    { tag: "BUMN", color: "#D97706", text: "Menteri BUMN dorong integrasi digital antar lembaga pemerintah — target 2027." },
    { tag: "EKONOMI", color: "#0891B2", text: "IDX 7,241 turun -0.12% · Rupiah Rp 16.420/USD · Inflasi Mei 2.8% YoY." },
    { tag: "GERINDRA", color: "#059669", text: "Gerindra gelar Rapimnas, evaluasi kinerja fraksi DPR — Prabowo buka sesi utama." },
  ]
};

const DUMMY_MONTHS = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DUMMY_ALERTS = [
  { level: "HIGH", issueType: "Krisis Reputasi", title: "Aksi Masa di Depan Istana", source: "Detikcom" },
  { level: "MED", issueType: "Trending Topik", title: "Tagar #PemerintahGagal Naik", source: "Twitter/X" },
  { level: "LOW", issueType: "Misinformasi", title: "Isu Kenaikan BBM Hoax", source: "TikTok" }
];
const DUMMY_POSTS = [
  { platform: "Twitter/X", content: "Harap ada transparansi untuk investasi baru ini. #KawalTerus", user: "@RakyatKritis", sentiment: "neutral" },
  { platform: "Instagram", content: "Luar biasa program ini sudah dirasakan sampai pelosok desa!", user: "@PemudaMaju", sentiment: "positive" },
  { platform: "TikTok", content: "Kok harga sembako malah naik terus ya? Ampun deh 😭", user: "@IbuCerdas", sentiment: "negative" },
];

export const MockDataContext = createContext<MockDataState>(initialMockState);

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MockDataState>(initialMockState);

  useEffect(() => {
    let tickCount = 0;
    const intervalId = setInterval(() => {
      tickCount++;
      setData((prev) => {
        const next = { ...prev };
        
        // 1. Chart Data - Add a new point every 3 ticks
        if (tickCount % 3 === 0) {
          const lastPoint = next.issueData[next.issueData.length - 1];
          const monthIdx = (next.issueData.length) % DUMMY_MONTHS.length;
          const iteration = Math.floor(next.issueData.length / DUMMY_MONTHS.length);
          const newPoint: IssueDataPoint = {
            month: DUMMY_MONTHS[monthIdx] + (iteration > 0 ? ` '${iteration}` : ""),
            Prabowo: Math.max(10, lastPoint.Prabowo + Math.floor(Math.random() * 20 - 10)),
            MBG: Math.max(10, lastPoint.MBG + Math.floor(Math.random() * 20 - 10)),
            Danantara: Math.max(10, lastPoint.Danantara + Math.floor(Math.random() * 20 - 10)),
            Gemoy: Math.max(10, lastPoint.Gemoy + Math.floor(Math.random() * 20 - 10)),
            Gerindra: Math.max(10, lastPoint.Gerindra + Math.floor(Math.random() * 20 - 10)),
          };
          next.issueData = [...next.issueData, newPoint];
          if (next.issueData.length > 15) next.issueData.shift(); // Keep last 15 points
        }

        // 2. Alert Panel
        if (Math.random() > 0.7) {
          const randomAlert = DUMMY_ALERTS[Math.floor(Math.random() * DUMMY_ALERTS.length)];
          const newAlert: AlertData = {
            id: Date.now(),
            level: randomAlert.level,
            issueType: randomAlert.issueType,
            timeLeft: "12:00",
            remaining: "100% Remaining",
            impact: "Unknown Exposure",
            title: randomAlert.title,
            source: `${randomAlert.source} · Detected ${new Date().getHours()}:${new Date().getMinutes()}`,
            mentions: "1.2K",
            mentionLabel: "Baru",
            topChannel: randomAlert.source,
            systemHealth: "100% Stable"
          };
          next.alerts = [newAlert, ...next.alerts].slice(0, 3);
        }

        // 3. Sentiments
        next.sentimentData = prev.sentimentData.map(s => {
          let change = Math.floor(Math.random() * 5 - 2); 
          return { ...s, value: Math.max(5, s.value + change) };
        });

        // 4. Social Posts
        if (Math.random() > 0.6) {
          const randomPost = DUMMY_POSTS[Math.floor(Math.random() * DUMMY_POSTS.length)];
          const newPost: SocialPost = {
            rank: 1,
            platform: randomPost.platform,
            time: "Baru saja",
            content: randomPost.content,
            user: randomPost.user,
            likes: Math.floor(Math.random() * 10) + "K",
            comments: Math.floor(Math.random() * 1000).toString(),
            sentiment: randomPost.sentiment
          };
          next.posts = [newPost, ...prev.posts].map((p, i) => ({ ...p, rank: i + 1 })).slice(0, 4);
        }

        // 5. Issues & Persons
        next.issues = prev.issues.map(iss => {
          const fluctuate = Math.random() > 0.5 ? 1 : -1;
          const up = fluctuate > 0;
          return { ...iss, score: Math.max(10, iss.score + fluctuate), change: `${up ? '+' : '-'}${(Math.random()*2).toFixed(1)}%`, up };
        });
        
        next.persons = prev.persons.map(p => {
          const fluctuate = Math.floor(Math.random() * 3);
          return { ...p, count: p.count + fluctuate };
        });

        // 6. Media Mentions
        next.mediaList = prev.mediaList.map(m => {
          return { ...m, mentions: m.mentions + Math.floor(Math.random() * 5) };
        });

        return next;
      });
    }, 2500); 

    return () => clearInterval(intervalId);
  }, []);

  return <MockDataContext.Provider value={data}>{children}</MockDataContext.Provider>;
};

export const useMockData = () => useContext(MockDataContext);
