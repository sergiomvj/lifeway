import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dreams from "./pages/Dreams";
import VisaMatch from "./pages/VisaMatch";
import Especialista from "./pages/Especialista";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminOpenAI from "./pages/AdminOpenAI";
import FerramentasIndex from "./pages/ferramentas/index";
import DestinosIndex from "./pages/destinos/index";
import BlogIndex from "./pages/blog/index";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dreams" element={<Dreams />} />
              <Route path="/visamatch" element={<VisaMatch />} />
              <Route path="/especialista" element={<Especialista />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/openai" element={<AdminOpenAI />} />
              <Route path="/ferramentas" element={<FerramentasIndex />} />
              <Route path="/destinos" element={<DestinosIndex />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;