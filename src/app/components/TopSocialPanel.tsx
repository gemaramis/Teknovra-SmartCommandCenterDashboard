import { Heart, MessageCircle, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";
const sentimentColor: Record<string, string> = { negative: "#DC2626", positive: "#059669", neutral: "#6E6791" };

export function TopSocialPanel() {
  const { posts } = useLiveData();
  return (
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-[#6E6791]">TOP SOCIAL POST</span>
        <div className="flex gap-1">
          <div className="w-4 h-1 rounded-full bg-[#7B2FD6]" />
          <div className="w-4 h-1 rounded-full bg-[#E7E4EF]" />
          <div className="w-4 h-1 rounded-full bg-[#E7E4EF]" />
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-auto">
        {posts.map((post) => (
          <div
            key={post.rank}
            onClick={() => toast.info(`Opening post by ${post.user}`)}
            className="rounded-lg p-3 cursor-pointer transition-colors bg-[#F7F6FA] border border-transparent hover:border-[#C9B2EE]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="rounded px-1.5 py-0.5 bg-[#F3EEFB] text-[0.65rem] font-semibold text-[#7B2FD6]">
                #{post.rank}
              </div>
              <div className="flex items-center gap-1">
                <Twitter size={10} className="text-[#9C96B5]" />
                <span className="text-[0.625rem] text-[#9C96B5]">{post.platform}</span>
              </div>
              <span className="text-[0.625rem] text-[#9C96B5] ml-auto">{post.time}</span>
            </div>
            <p className="text-[0.8rem] leading-normal text-[#443C66] mb-2.5">{post.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-[0.625rem] text-[#9C96B5]">{post.user}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Heart size={10} style={{ color: sentimentColor[post.sentiment] }} />
                  <span className="text-[0.625rem] text-[#191233]">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={10} className="text-[#9C96B5]" />
                  <span className="text-[0.625rem] text-[#191233]">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
