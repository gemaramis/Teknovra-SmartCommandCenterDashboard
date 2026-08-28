import { User } from "lucide-react";
import { toast } from "sonner";
import { useLiveData } from "../contexts/LiveDataContext";

export function PersonPanel() {
  const { persons } = useLiveData();
  const total = persons.reduce((s, p) => s + p.count, 0);
  return (
    <div className="bg-white border border-[#E7E4EF] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-[#6E6791]">PERSON</span>
        <span className="text-[0.8rem] font-semibold text-[#7B2FD6]">{total} Total</span>
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-auto">
        {persons.map((p) => (
          <div
            key={p.name}
            onClick={() => toast.info(`Viewing profile for ${p.name}`)}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-colors hover:bg-[#F7F6FA] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#F3EEFB]">
              <User size={12} className="text-[#7B2FD6]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.85rem] font-medium text-[#191233] truncate">{p.name}</div>
              <div className="text-[0.625rem] text-[#9C96B5]">{p.role}</div>
            </div>
            <span className="text-[0.85rem] font-semibold text-[#7B2FD6]">{p.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
