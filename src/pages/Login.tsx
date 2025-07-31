import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-petroleo to-petroleo/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-figtree font-medium">Voltar ao início</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-petroleo to-petroleo/80 rounded-2xl flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            
            <h1 className="text-3xl font-baskerville font-bold text-petroleo mb-2">
              Bem-vindo ao LifeWayUSA
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Acesse sua conta para continuar sua jornada rumo aos Estados Unidos
            </p>

            <Button variant="outline" size="lg" className="w-full mb-4">
              Entrar com Google
            </Button>

            <Button variant="ghost" size="lg" className="w-full">
              Continuar como visitante
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;