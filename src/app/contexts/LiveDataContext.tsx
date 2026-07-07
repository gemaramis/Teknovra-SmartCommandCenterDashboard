import React, { createContext, useContext, useState, useEffect } from "react";

export interface IssueDataPoint {
  month: string;
  Prabowo: number;
  MBG: number;
  Danantara: number;
  Gemoy: number;
  Gerindra: number;
}

export interface SentimentDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface SocialPost {
  rank: number;
  platform: string;
  time: string;
  content: string;
  user: string;
  likes: string;
  comments: string;
  sentiment: string;
}

export interface IssueItem {
  id: string;
  topic: string;
  score: number;
  change: string;
  up: boolean;
}

export interface PersonItem {
  name: string;
  role: string;
  count: number;
  sentiment: "positive" | "negative" | "neutral";
}

export interface AlertItem {
  level: "HIGH" | "MED" | "LOW";
  issueType: string;
  title: string;
  source: string;
}

export interface MediaItem {
  name: string;
  type: string;
  mentions: number;
  reach: string;
}

export interface TickerItem {
  tag: string;
  color: string;
  text: string;
}

export interface LiveDataState {
  issueData: IssueDataPoint[];
  sentimentData: SentimentDataPoint[];
  posts: SocialPost[];
  issues: IssueItem[];
  persons: PersonItem[];
  alerts: AlertItem[];
  mediaList: MediaItem[];
  tickerItems: TickerItem[];
}

const initialLiveState: LiveDataState = {
  issueData: [],
  sentimentData: [],
  posts: [],
  issues: [],
  persons: [],
  alerts: [],
  mediaList: [],
  tickerItems: []
};

export const LiveDataContext = createContext<LiveDataState>(initialLiveState);

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LiveDataState>(initialLiveState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, mentionsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/mentions")
        ]);

        if (!statsRes.ok || !mentionsRes.ok) return;

        const stats = await statsRes.json();
        const mentionsData = await mentionsRes.json();
        const mentions = mentionsData.data || [];

        // Map live data into the dashboard's required structures
        const kpis = stats.kpis || { positive: 0, negative: 0, neutral: 0 };
        const sentimentData: SentimentDataPoint[] = [
          { name: "Positive", value: kpis.positive, color: "#10B981" },
          { name: "Negative", value: kpis.negative, color: "#EF4444" },
          { name: "Neutral", value: kpis.neutral, color: "#6B7280" }
        ];

        const posts: SocialPost[] = mentions.slice(0, 10).map((m: any, i: number) => ({
          rank: i + 1,
          platform: m.source,
          time: new Date(m.pubDate).toLocaleTimeString(),
          content: m.title,
          user: "News Outlet",
          likes: "0",
          comments: "0",
          sentiment: m.sentiment.toLowerCase()
        }));

        const issues: IssueItem[] = (stats.topIssues || []).slice(0, 5).map((iss: any, i: number) => ({
          id: `iss-${i}`,
          topic: iss.name,
          score: iss.count,
          change: "+0%",
          up: true
        }));

        const mediaList: MediaItem[] = (stats.sources || []).map((s: any) => ({
          name: s.name,
          type: "News",
          mentions: s.count,
          reach: s.val
        }));

        const alerts: AlertItem[] = mentions
          .filter((m: any) => m.sentiment === "NEGATIVE")
          .slice(0, 5)
          .map((m: any) => ({
            level: "HIGH",
            issueType: "Negative Sentiment",
            title: m.title,
            source: m.source
          }));

        const tickerItems: TickerItem[] = mentions.slice(0, 10).map((m: any) => ({
          tag: m.sentiment,
          color: m.sentiment === "POSITIVE" ? "#10B981" : m.sentiment === "NEGATIVE" ? "#EF4444" : "#6B7280",
          text: m.title
        }));

        setData({
          issueData: [], // Timeline mapping would go here
          sentimentData,
          posts,
          issues,
          persons: [], // Person specific mapping would go here
          alerts,
          mediaList,
          tickerItems
        });
      } catch (err) {
        console.error("Failed to fetch live dashboard data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return <LiveDataContext.Provider value={data}>{children}</LiveDataContext.Provider>;
};

export const useLiveData = () => useContext(LiveDataContext);
