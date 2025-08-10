import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, BarChart3, LogOut, User, Menu, X } from "lucide-react";
import { useUserContext } from "@/hooks/useUserContext";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userContext, isLoading } = useUserContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFerramentasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Se já estamos na home, apenas scroll para a seção
      const ferramentasSection = document.getElementById('ferramentas');
      if (ferramentasSection) {
        ferramentasSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Se não estamos na home, navegar para home com hash
      window.location.href = '/#ferramentas';
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        return;
      }
      
      // Fechar menu mobile e redirecionar para home após logout
      setIsMobileMenuOpen(false);
      navigate('/');
      // Forçar recarregamento da página para garantir que o estado de autenticação seja atualizado
      window.location.reload();
    } catch (error) {
      console.error('Erro inesperado ao fazer logout:', error);
    }
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Verificar se o usuário está logado
  // Usando a verificação do objeto user do Supabase para maior consistência
  // Adicionando console.log para debug
  console.log('Auth status:', { user, userContext, isLoading });
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-gray-900">LifeWayUSA</span>
          </Link>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <button
              onClick={handleFerramentasClick}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Ferramentas
            </button>
            <Link 
              to="/destinos" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Destinos
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link 
              to="/contato" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contato
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {isLoggedIn && (
              <Link 
                to="/profile" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                Perfil
              </Link>
            )}
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">Entrar/Cadastrar</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={handleMobileLinkClick}
              >
                Home
              </Link>
              <button
                onClick={(e) => {
                  handleFerramentasClick(e);
                  handleMobileLinkClick();
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Ferramentas
              </button>
              <Link 
                to="/destinos" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={handleMobileLinkClick}
              >
                Destinos
              </Link>
              <Link 
                to="/blog" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={handleMobileLinkClick}
              >
                Blog
              </Link>
              <Link 
                to="/contato" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={handleMobileLinkClick}
              >
                Contato
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </div>
                </Link>
              )}
              {isLoggedIn && (
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </div>
                </Link>
              )}
              
              {/* Mobile Auth Button */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                {isLoggedIn ? (
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                ) : (
                  <Link to="/login" onClick={handleMobileLinkClick}>
                    <Button className="w-full">
                      Entrar / Cadastrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
