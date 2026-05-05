import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import AppShell from "./components/AppShell";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Scripts from "./pages/Scripts";
import LogShift from "./pages/LogShift";
import Insights from "./pages/Insights";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ShellLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!ready ? (
          <div className="min-h-screen bg-sh-bg" />
        ) : !session ? (
          <Auth />
        ) : (
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
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
