import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PoliticaDePrivacidade = () => (
  <div className="bg-background min-h-screen flex flex-col">
    <Navbar />
    <main className="container mx-auto max-w-2xl px-4 py-12 bg-white rounded-xl shadow-lg flex-1">
      <h1 className="text-3xl font-baskerville font-bold text-petroleo mb-6 text-center">Política de Privacidade</h1>
      <p className="text-gray-600 mb-4">Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações dos usuários em nossa plataforma Lifeway.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Coleta de Informações</h2>
      <p className="text-gray-600 mb-4">Coletamos informações fornecidas voluntariamente pelo usuário, como nome, e-mail e dados de perfil, além de dados de navegação e autenticação via Google OAuth.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Uso das Informações</h2>
      <p className="text-gray-600 mb-4">Utilizamos os dados para oferecer nossos serviços, melhorar a experiência do usuário, personalizar conteúdos e garantir a segurança da plataforma.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Compartilhamento</h2>
      <p className="text-gray-600 mb-4">Não compartilhamos informações pessoais com terceiros, exceto quando exigido por lei ou para funcionamento de integrações essenciais (ex: autenticação Google).</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Segurança</h2>
      <p className="text-gray-600 mb-4">Adotamos medidas técnicas e administrativas para proteger os dados dos usuários contra acessos não autorizados.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Direitos do Usuário</h2>
      <p className="text-gray-600 mb-4">O usuário pode solicitar a exclusão ou alteração de seus dados pessoais a qualquer momento.</p>
      <h2 className="text-xl font-semibold text-petroleo mt-8 mb-2">Alterações</h2>
      <p className="text-gray-600 mb-4">Esta política pode ser atualizada periodicamente. Recomendamos a revisão regular deste documento.</p>
      <p className="text-gray-600 mb-4">Em caso de dúvidas, entre em contato pelo e-mail informado na plataforma.</p>
    </main>
    <Footer />
  </div>
);

export default PoliticaDePrivacidade;
