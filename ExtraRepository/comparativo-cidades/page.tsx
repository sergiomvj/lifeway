import TemplatePages from '../components/TemplatePages';

export default function ComparativoCidadesPage() {
  return (
    <TemplatePages title="Comparativo de Cidades" subtitle="Compare cidades dos EUA em custo de vida, clima, oportunidades e mais.">
      <div className="space-y-8">
        {/* Aqui você pode adicionar componentes de comparação dinâmica ou tabelas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Exemplo de Comparativo</h2>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Cidade</th>
                <th className="border px-4 py-2">Estado</th>
                <th className="border px-4 py-2">Custo de Vida</th>
                <th className="border px-4 py-2">Clima</th>
                <th className="border px-4 py-2">Oportunidades</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Miami</td>
                <td className="border px-4 py-2">FL</td>
                <td className="border px-4 py-2">Alto</td>
                <td className="border px-4 py-2">Tropical</td>
                <td className="border px-4 py-2">Empregos, Estudo</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Orlando</td>
                <td className="border px-4 py-2">FL</td>
                <td className="border px-4 py-2">Médio</td>
                <td className="border px-4 py-2">Subtropical</td>
                <td className="border px-4 py-2">Turismo, Tecnologia</td>
              </tr>
              {/* Adicione mais cidades conforme necessário */}
            </tbody>
          </table>
        </div>
      </div>
    </TemplatePages>
  );
}
