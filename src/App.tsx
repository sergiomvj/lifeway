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
import FerramentasIndex from "./pages/ferramentas/index";
import DestinosIndex from "./pages/destinos/index";
import BlogIndex from "./pages/blog/index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dreams" element={<Dreams />} />
          <Route path="/visamatch" element={<VisaMatch />} />
          <Route path="/especialista" element={<Especialista />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ferramentas" element={<FerramentasIndex />} />
          <Route path="/destinos" element={<DestinosIndex />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;