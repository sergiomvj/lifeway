import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CityDetailPage from "./pages/destinos/cidade";

import React, { lazy, Suspense } from 'react';
import ProtectedRoute from "./components/ProtectedRoute";
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
import ComparativoCidades from "./pages/destinos/comparativo";
import Cities from "./pages/Cities";
import PlanejeSonhe from "./pages/PlanejeSonhe";
import BlogIndex from "./pages/blog/index";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import { FavoriteCitiesProvider } from "./contexts/FavoriteCitiesContext";

// Lazy load ferramenta pages
const CalcwayPage = lazy(() => import('./pages/ferramentas/calcway/index'));
const FamilyPlannerPage = lazy(() => import('./pages/ferramentas/family-planner/index'));
const GetOpportunityPage = lazy(() => import('./pages/ferramentas/get-opportunity/index'));
const ProjectUsaPage = lazy(() => import('./pages/ferramentas/project-usa/index'));
const ServiceWayPage = lazy(() => import('./pages/ferramentas/service-way/index'));
const SimuladorEntrevistaPage = lazy(() => import('./pages/ferramentas/simulador-entrevista/index'));

// Componente de carregamento para ferramentas
const FerramentaLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Carregando ferramenta...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FavoriteCitiesProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/planeje-sonhe" element={<PlanejeSonhe />} />
                <Route path="/dreams" element={<Dreams />} />
                <Route path="/visamatch" element={<VisaMatch />} />
                <Route path="/especialista" element={<Especialista />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin/openai" element={<ProtectedRoute><AdminOpenAI /></ProtectedRoute>} />
                <Route path="/ferramentas" element={<FerramentasIndex />} />
                <Route path="/ferramentas/calcway" element={
                  <Suspense fallback={<FerramentaLoading />}>
                    <CalcwayPage />
                  </Suspense>
                } />
                <Route path="/ferramentas/family-planner" element={
                  <Suspense fallback={<FerramentaLoading />}>
                    <FamilyPlannerPage />
                  </Suspense>
                } />
                <Route path="/ferramentas/get-opportunity" element={
                  <Suspense fallback={<FerramentaLoading />}>
                    <GetOpportunityPage />
                  </Suspense>
                } />
                <Route path="/ferramentas/project-usa" element={
                  <Suspense fallback={<FerramentaLoading />}>
                    <ProjectUsaPage />
                  </Suspense>
                } />
                <Route path="/ferramentas/service-way" element={
                  <Suspense fallback={<FerramentaLoading />}>
                    <ServiceWayPage />
                  </Suspense>
                } />
                <Route path="/ferramentas/simulador-entrevista" element={
                  <Suspense fallback={<FerramentaLoading />}>
                    <SimuladorEntrevistaPage />
                  </Suspense>
                } />
                <Route path="/destinos" element={<DestinosIndex />} />
                <Route path="/destinos/cidade/:id" element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando detalhes da cidade...</div>}>
                    <CityDetailPage />
                  </Suspense>
                } />
                <Route path="/destinos/comparativo" element={<ComparativoCidades />} />
                <Route path="/cities" element={<Cities />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </FavoriteCitiesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;