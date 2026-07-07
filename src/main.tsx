import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App.tsx";
import "./styles/index.css";

import { LiveDataProvider } from "./app/contexts/LiveDataContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LiveDataProvider>
      <App />
    </LiveDataProvider>
  </QueryClientProvider>
);
