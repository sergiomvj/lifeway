 Criador de Sonhos

Ferramenta se propoe a simular cenários para pessoas e familias se imigrarem para os EUA com diferentes propositos. Iniciar com um onboarding form com perguntas e oferecendo opcoes de cidades para o usuário marcar e verificar possibilidades profissionais, academicas e pessoais com a mudança. Seria nosso recuros de entrada, totalmente free e orientado por IA com um sistema de funil de opçoes para possibilitar a criação de "novas vidas" nos EUa.


Entrada de Dados: Formulário Multistep (src/components/forms/MultistepForm.tsx e src/components/forms/ProspectFormSteps.tsx). Os dados são salvos na tabela multistep_forms (o Id é gerado aqui).
Lógica Backend (src/app/api/tools/criador-sonhos/process-form/route.ts):
Recebe os dados do formulário do frontend (incluindo user_id se logado, ou cria prospect anônimo).
Salva/Atualiza os dados na tabela multistep_forms.
Pode iniciar uma chamada assíncrona para a OpenAI para gerar uma "pré-análise" ou "resumo do sonho" inicial e armazená-lo em um novo campo analise_criador_sonhos na tabela multistep_forms.

Interface do formulário multistep.
Exibe o resultado inicial da IA ou direciona para o Dashboard/ferramentas após o preenchimento.