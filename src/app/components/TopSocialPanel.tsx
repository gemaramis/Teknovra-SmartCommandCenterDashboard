import { Heart, MessageCircle, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";
const sentimentColor: Record<string, string> = { negative: "#EF4444", positive: "#059669", neutral: "#7B6BAA" };

export function TopSocialPanel() {
  const { posts } = useMockData();
  return (
    <div className="rounded-xl p-4 flex flex-col h-full" style={{ background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.5)", boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#1A1230", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}>TOP SOCIAL POST</span>
        <div className="flex gap-1">
          <div className="w-4 h-1 rounded-full" style={{ background: "#7B2FD6" }} />
          <div className="w-4 h-1 rounded-full" style={{ background: "#C9BAF0" }} />
          <div className="w-4 h-1 rounded-full" style={{ background: "#C9BAF0" }} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 overflow-auto">
        {posts.map((post) => (
          <div
            key={post.rank}
            onClick={() => toast.info(`Opening post by ${post.user}`)}
            className="rounded-xl p-3 cursor-pointer transition-all hover:shadow-md"
            style={{ background: "#F4F2F9", border: "1px solid rgba(123,47,214,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="rounded px-1.5 py-0.5" style={{ background: "rgba(123,47,214,0.12)", fontSize: "0.65rem", color: "#7B2FD6", fontWeight: 700 }}>
                #{post.rank}
              </div>
              <div className="flex items-center gap-1">
                <Twitter size={10} style={{ color: "#7B6BAA" }} />
                <span style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{post.platform}</span>
              </div>
              <span style={{ color: "#7B6BAA", fontSize: "0.625rem", marginLeft: "auto" }}>{post.time}</span>
            </div>
            <p style={{ color: "#4B3F80", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "0.75rem" }}>{post.content}</p>
            <div className="flex items-center justify-between">
              <span style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{post.user}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Heart size={10} style={{ color: sentimentColor[post.sentiment] }} />
                  <span style={{ color: "#1A1230", fontSize: "0.625rem" }}>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={10} style={{ color: "#7B6BAA" }} />
                  <span style={{ color: "#1A1230", fontSize: "0.625rem" }}>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
