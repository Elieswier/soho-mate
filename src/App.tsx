import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "./components/AppShell";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Scripts from "./pages/Scripts";
import LogShift from "./pages/LogShift";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ShellLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<ShellLayout />}>
            <Route path="/" element={<Flashcards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/log-shift" element={<LogShift />} />
            <Route path="/insights" element={<Insights />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
