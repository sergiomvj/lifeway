import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-gray-900">LifeWay USA</span>
          </Link>

          {/* Menu Items */}
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
            <Button asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
