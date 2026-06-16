import { User } from "lucide-react";
import { toast } from "sonner";
import { useMockData } from "../contexts/MockDataContext";

export function PersonPanel() {
  const { persons } = useMockData();
  const total = persons.reduce((s, p) => s + p.count, 0);
  return (
    <div className="rounded-3xl p-6 p-4 flex flex-col h-full" style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.8)", boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "#1A1230", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}>PERSON</span>
        <span style={{ color: "#7B2FD6", fontSize: "0.85rem", fontWeight: 700 }}>{total} Total</span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 overflow-auto">
        {persons.map((p) => (
          <div
            key={p.name}
            onClick={() => toast.info(`Viewing profile for ${p.name}`)}
            className="flex items-center gap-2 py-1.5 px-2 rounded-3xl p-6 transition-colors hover:bg-[#F4F2F9] cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(123,47,214,0.1)", border: "1px solid rgba(123,47,214,0.2)" }}
            >
              <User size={12} style={{ color: "#7B2FD6" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ color: "#1A1230", fontSize: "0.85rem", fontWeight: 500 }} className="truncate">{p.name}</div>
              <div style={{ color: "#7B6BAA", fontSize: "0.625rem" }}>{p.role}</div>
            </div>
            <span style={{ color: "#D946EF", fontSize: "0.9rem", fontWeight: 700 }}>{p.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
