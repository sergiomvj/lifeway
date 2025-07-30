import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const handleGoogleLogin = () => {
    // Aqui seria implementada a integração com Supabase OAuth
    console.log("Implementar login com Google via Supabase");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-petroleo to-petroleo/80 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-figtree font-medium">Voltar ao início</span>
        </Link>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            {/* Logo */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-petroleo to-petroleo/80 rounded-2xl flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            
            <CardTitle className="text-3xl font-baskerville font-bold text-petroleo mb-2">
              Bem-vindo ao LifeWayUSA
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Acesse sua conta para continuar sua jornada rumo aos Estados Unidos
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full h-14 text-base font-figtree font-medium border-2 border-gray-200 hover:border-petroleo hover:bg-petroleo/5 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Entrar com Google</span>
              </div>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-figtree">ou</span>
              </div>
            </div>

            {/* Guest Access */}
            <Link to="/dreams">
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-14 text-base font-figtree font-medium text-petroleo hover:bg-petroleo/5 transition-all duration-300"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Continuar como visitante
              </Button>
            </Link>

            {/* Benefits Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-baskerville font-bold text-petroleo mb-4 text-center">
                Vantagens de ter uma conta
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Salvar progresso das ferramentas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Histórico de análises personalizadas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Acompanhamento do seu progresso</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Notificações de atualizações importantes</span>
                </li>
              </ul>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 leading-relaxed">
              Ao continuar, você concorda com nossos{" "}
              <Link to="/termos" className="text-petroleo hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/privacidade" className="text-petroleo hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-white/70 text-sm font-figtree">
            Sua jornada rumo ao sonho americano começa aqui
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;