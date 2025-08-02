import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UnifiedDashboard } from '@/components/UnifiedDashboard';
import DashboardDebug from '@/components/DashboardDebug';
import UnifiedDashboardSimple from '@/components/UnifiedDashboardSimple';
import UnifiedDashboardDiagnostic from '@/components/UnifiedDashboardDiagnostic';
import UserContextManager from '@/components/UserContextManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Context Manager - Garante que o usuário tenha contexto */}
      <UserContextManager />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Dashboard Unificado
              </h1>
              <p className="text-gray-600 mt-2">
                Acompanhe seu progresso na jornada de imigração para os EUA
              </p>
            </div>
          </div>
        </div>

        {/* Informações sobre o Dashboard */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Dashboard Inteligente:</strong> Este painel consolida todas as suas ferramentas, 
            progresso e dados em um só lugar. Navegue pelas abas para explorar diferentes aspectos 
            da sua jornada de imigração.
          </AlertDescription>
        </Alert>

        {/* Dashboard Unificado */}
        <UnifiedDashboardDiagnostic />
        {/* <UnifiedDashboardSimple /> */}
        {/* <DashboardDebug /> */}
        {/* <UnifiedDashboard /> */}
        
        {/* Informações Adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Como usar o Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Visão Geral</p>
                  <p className="text-sm text-gray-600">Veja seu progresso geral e estatísticas principais</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Progresso</p>
                  <p className="text-sm text-gray-600">Acompanhe seu avanço em cada etapa da jornada</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Conquistas</p>
                  <p className="text-sm text-gray-600">Desbloqueie achievements conforme avança</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">Dados</p>
                  <p className="text-sm text-gray-600">Gerencie a sincronização entre suas ferramentas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">✓ Dashboard Integrado</p>
                <p className="text-sm text-green-600">Seu dashboard está funcionando perfeitamente!</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">🚀 Ferramentas Disponíveis</p>
                <p className="text-sm text-blue-600">Criador de Sonhos, VisaMatch, Chat com Especialista</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-medium text-purple-800">📊 Analytics Ativos</p>
                <p className="text-sm text-purple-600">Seus dados estão sendo sincronizados automaticamente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
