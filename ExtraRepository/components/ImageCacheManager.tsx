'use client'

import { clearImageCache, getCacheInfo, validateFallbackImages, isImageUrlValid } from '../lib/imageUtils-simple'
// import { backupImageUsageData, cleanupOldBackups } from '../lib/imageUsagePersistence'

export default function ImageCacheManager() {
  const handleClearCache = () => {
    clearImageCache()
    window.location.reload() // Recarregar para ver as novas imagens
  }

  const handleShowCacheInfo = () => {
    const cacheInfo = getCacheInfo()
    
    console.log('Cache info:', cacheInfo)
    
    alert(`
CACHE: ${cacheInfo.size} entradas em memória

ENTRADAS:
${cacheInfo.entries.map((entry, i) => `${i + 1}. ${entry}`).join('\n')}

Veja o console para detalhes completos.
    `.trim())
  }

  const handleValidateFallbacks = async () => {
    try {
      alert('🔍 Iniciando validação das imagens de fallback...\nVerifique o console para detalhes.')
      const validUrls = await validateFallbackImages()
      alert(`✅ Validação concluída!\n\n${validUrls.length} de 14 imagens de fallback estão funcionando.\n\nDetalhes no console.`)
    } catch (error) {
      alert(`❌ Erro durante validação: ${error.message}`)
    }
  }

  const handleTestSpecificUrl = async () => {
    const url = prompt('Digite a URL da imagem para testar:')
    if (!url) return
    
    try {
      alert('🔍 Testando URL...\nVerifique o console para detalhes.')
      const isValid = await isImageUrlValid(url)
      alert(`Resultado para:\n${url}\n\n${isValid ? '✅ URL VÁLIDA' : '❌ URL INVÁLIDA'}`)
    } catch (error) {
      alert(`❌ Erro ao testar URL: ${error.message}`)
    }
  }

  const handleCleanupOld = () => {
    alert('Função de limpeza não disponível na versão simplificada')
  }

  const handleBackup = () => {
    // const backupPath = backupImageUsageData()
    // if (backupPath) {
    //   alert(`Backup criado com sucesso!`)
    // } else {
    //   alert(`Erro ao criar backup ou nenhum dado para backup`)
    // }
    alert('Backup temporariamente desabilitado - dados em memória')
  }

  const handleCleanupBackups = () => {
    // const cleaned = cleanupOldBackups()
    // alert(`Backups limpos: ${cleaned} arquivos antigos removidos`)
    alert('Limpeza de backups temporariamente desabilitada')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border space-y-2 max-w-xs">
      <div className="text-sm font-semibold text-gray-700">Controle de Imagens</div>
      
      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        🧠 Sistema em memória ativo<br/>
        ⚠️ Dados perdidos ao reiniciar
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleClearCache}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Limpar Cache RAM
        </button>
        <button
          onClick={handleShowCacheInfo}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Ver Cache
        </button>
        <button
          onClick={handleValidateFallbacks}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Testar Fallbacks
        </button>
        <button
          onClick={handleTestSpecificUrl}
          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
        >
          Testar URL
        </button>
        <button
          onClick={handleCleanupOld}
          className="px-3 py-1 bg-gray-400 text-white text-xs rounded cursor-not-allowed"
          disabled
        >
          Limpar Antigos (N/A)
        </button>
        <button
          onClick={handleBackup}
          className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
        >
          Criar Backup
        </button>
        <button
          onClick={handleCleanupBackups}
          className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
        >
          Limpar Backups
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        � Verificação de URLs ativa<br/>
        �️ Fallback determinístico<br/>
        ⚡ Cache em memória
      </div>
    </div>
  )
}
