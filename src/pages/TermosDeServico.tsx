import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermosDeServico = () => (
  <div className="bg-background min-h-screen flex flex-col">
    <Navbar />
    <main className="container mx-auto max-w-2xl px-4 py-12 bg-white rounded-xl shadow-lg flex-1">
      <h1 className="text-3xl font-baskerville font-bold text-petroleo mb-6 text-center">Termos de Serviço</h1>
      <p className="text-gray-600 mb-4">Estes Termos de Serviço regulam o uso da plataforma Lifeway, seus recursos e funcionalidades.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Uso da Plataforma</h2>
      <p className="text-gray-600 mb-4">O usuário concorda em utilizar a plataforma de acordo com as leis vigentes e respeitar os direitos de outros usuários.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Cadastro e Autenticação</h2>
      <p className="text-gray-600 mb-4">Para acessar determinados recursos, o usuário deve se cadastrar e autenticar, podendo utilizar o Google OAuth.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Conteúdo</h2>
      <p className="text-gray-600 mb-4">O conteúdo disponibilizado é de responsabilidade dos autores e pode ser alterado ou removido a qualquer momento.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Limitação de Responsabilidade</h2>
      <p className="text-gray-600 mb-4">A Lifeway não se responsabiliza por danos decorrentes do uso indevido da plataforma ou de falhas externas.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Privacidade</h2>
      <p className="text-gray-600 mb-4">O uso da plataforma está sujeito à nossa Política de Privacidade.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Alterações</h2>
      <p className="text-gray-600 mb-4">Os Termos de Serviço podem ser atualizados periodicamente. O uso contínuo da plataforma implica concordância com as alterações.</p>
      <p className="text-gray-600 mb-4">Em caso de dúvidas, entre em contato pelo e-mail informado na plataforma.</p>
    </main>
    <Footer />
  </div>
);

export default TermosDeServico;
