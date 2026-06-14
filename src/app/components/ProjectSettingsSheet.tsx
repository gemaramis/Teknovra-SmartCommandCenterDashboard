import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Settings, User, Bell, Database, Palette, Save } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSettingsSheet({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState("general");
  
  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "data", label: "Data Integration", icon: Database },
    { id: "alerts", label: "Alert Rules", icon: Bell },
    { id: "team", label: "Team Management", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 border-b" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
          <SheetTitle style={{ color: "#1A1230", fontSize: "1.25rem" }}>Project Settings</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-[180px] border-r p-4 flex flex-col gap-1 bg-[#F4F2F9]" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-left"
                style={{
                  background: activeTab === tab.id ? "#7B2FD6" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "#7B6BAA",
                }}
              >
                <tab.icon size={14} />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "general" && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold" style={{ color: "#1A1230" }}>General Settings</h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Project Name</label>
                  <input type="text" defaultValue="Teknovra Smart Dashboard" className="w-full border p-2 rounded-md text-sm outline-none focus:border-[#7B2FD6]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Timezone</label>
                  <select className="w-full border p-2 rounded-md text-sm outline-none focus:border-[#7B2FD6]">
                    <option>Asia/Jakarta (WIB)</option>
                    <option>Asia/Makassar (WITA)</option>
                    <option>Asia/Jayapura (WIT)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold" style={{ color: "#1A1230" }}>Data Integrations</h3>
                <p className="text-sm text-gray-500 mb-2">Connect APIs to stream live data.</p>
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold block">Twitter/X API</span>
                    <span className="text-xs text-green-600">Connected</span>
                  </div>
                  <button className="text-xs border px-3 py-1 rounded bg-gray-50">Manage</button>
                </div>
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold block">News Scraping Engine</span>
                    <span className="text-xs text-green-600">Connected</span>
                  </div>
                  <button className="text-xs border px-3 py-1 rounded bg-gray-50">Manage</button>
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold" style={{ color: "#1A1230" }}>Crisis Alert Rules</h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Mention Spike Threshold</label>
                  <input type="number" defaultValue="500" className="w-full border p-2 rounded-md text-sm outline-none focus:border-[#7B2FD6]" />
                  <p className="text-xs text-gray-400 mt-1">Triggers alert if mentions exceed this within 1 hour.</p>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold" style={{ color: "#1A1230" }}>Team Management</h3>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-bold block">Admin User</span>
                  <span className="text-xs text-gray-500">admin@teknovra.com</span>
                </div>
                <button className="text-xs border px-3 py-2 rounded text-[#7B2FD6] font-bold mt-2 text-center w-full">
                  + Invite Team Member
                </button>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold" style={{ color: "#1A1230" }}>Appearance</h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Theme</label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border rounded-md border-[#7B2FD6] bg-[#F4F2F9] text-sm font-semibold text-[#7B2FD6]">Light</button>
                    <button className="flex-1 py-2 border rounded-md text-sm text-gray-500">Dark</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: "rgba(123,47,214,0.12)" }}>
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 text-sm text-white rounded-md transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #7B2FD6, #D946EF)" }}>
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
