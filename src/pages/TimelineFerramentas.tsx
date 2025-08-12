import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  Compass,
  Stars,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

const TimelineFerramentas = () => {
  const navigate = useNavigate();

  // Mock data - em produção, isso viria do banco de dados
  const ferramentasUtilizadas = [
    {
      id: 1,
      nome: 'Criador de Sonho',
      icone: <Sparkles className="h-6 w-6 text-blue-600" />,
      dataUso: '2024-01-15',
      status: 'Concluído',
      relatorio: '/relatorios/dreams-report-123.pdf',
      descricao: 'Relatório completo sobre seu perfil de sonhos americanos'
    },
    {
      id: 2,
      nome: 'Visamatch',
      icone: <Compass className="h-6 w-6 text-green-600" />,
      dataUso: '2024-01-20',
      status: 'Concluído',
      relatorio: '/relatorios/visamatch-report-456.pdf',
      descricao: 'Análise detalhada dos vistos mais adequados ao seu perfil'
    },
    {
      id: 3,
      nome: 'LIA - LifeWay Intelligent Assistant',
      icone: <Stars className="h-6 w-6 text-purple-600" />,
      dataUso: null,
      status: 'Não utilizado',
      relatorio: null,
      descricao: 'Consultoria personalizada com especialista em imigração'
    }
  ];

  const handleViewReport = (relatorio: string) => {
    // Em produção, isso abriria o PDF ou navegaria para a página do relatório
    window.open(relatorio, '_blank');
  };

  const handleDownloadReport = (relatorio: string) => {
    // Em produção, isso faria o download do relatório
    const link = document.createElement('a');
    link.href = relatorio;
    link.download = relatorio.split('/').pop() || 'relatorio.pdf';
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Concluído':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Concluído
        </Badge>;
      case 'Não utilizado':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <Clock className="h-3 w-3 mr-1" />
          Não utilizado
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Timeline das Ferramentas
            </h1>
            <p className="text-xl text-gray-600">
              Acompanhe o histórico de uso das ferramentas e acesse seus relatórios
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Ferramentas Utilizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {ferramentasUtilizadas.filter(f => f.status === 'Concluído').length}
              </div>
              <p className="text-sm text-gray-600">de {ferramentasUtilizadas.length} disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                Relatórios Gerados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {ferramentasUtilizadas.filter(f => f.relatorio).length}
              </div>
              <p className="text-sm text-gray-600">prontos para download</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                Última Atualização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
              <p className="text-sm text-gray-600">dados atualizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline das Ferramentas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Histórico de Utilização
          </h2>

          {ferramentasUtilizadas.map((ferramenta, index) => (
            <Card key={ferramenta.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {ferramenta.icone}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ferramenta.nome}
                        </h3>
                        {getStatusBadge(ferramenta.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {ferramenta.descricao}
                      </p>
                      
                      {ferramenta.dataUso && (
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          Utilizado em: {new Date(ferramenta.dataUso).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2">
                    {ferramenta.relatorio ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(ferramenta.relatorio!)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(ferramenta.relatorio!)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    ) : ferramenta.status === 'Não utilizado' ? (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/${ferramenta.nome.toLowerCase().replace(' ', '-')}`)}
                      >
                        Usar Ferramenta
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Continue Sua Jornada
              </h3>
              <p className="text-blue-700 mb-6">
                Utilize todas as ferramentas disponíveis para ter uma visão completa 
                da sua jornada de imigração para os EUA.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Voltar ao Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TimelineFerramentas;
