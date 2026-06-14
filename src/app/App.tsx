import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { DashboardPage } from "./components/DashboardPage";
import { ReportPage } from "./components/ReportPage";
import { EscalationPage } from "./components/EscalationPage";
import { AiResponsePage } from "./components/AiResponsePage";
import { LaunchScreen } from "./components/LaunchScreen";
import { SearchScrapingPage } from "./components/SearchScrapingPage";
import { GenerateActionPage } from "./components/GenerateActionPage";
import { ProfileBuilderPage } from "./components/ProfileBuilderPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/escalation/:id" element={<EscalationPage />} />
        <Route path="/ai-response/:id" element={<AiResponsePage />} />
        <Route path="/trends/:query" element={<SearchScrapingPage />} />
        <Route path="/generate-action" element={<GenerateActionPage />} />
        <Route path="/profile-builder" element={<ProfileBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
