import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { DashboardPage } from "./components/DashboardPage";
import { ReportPage } from "./components/ReportPage";
import { EscalationPage } from "./components/EscalationPage";
import { AiResponsePage } from "./components/AiResponsePage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/escalation/:id" element={<EscalationPage />} />
        <Route path="/ai-response/:id" element={<AiResponsePage />} />
      </Routes>
    </BrowserRouter>
  );
}
