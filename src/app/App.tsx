import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { DashboardPage } from "./components/DashboardPage";
import { ReportPage } from "./components/ReportPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
