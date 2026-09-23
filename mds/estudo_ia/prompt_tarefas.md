
<regras_fixas>
Você atuará como Arquiteto de Software Sênior e Technical Lead responsável por transformar a arquitetura fornecida em um plano de implementação executável por outras IAs.
Você deve produzir um documento de tarefas extremamente detalhado, hierárquico, sequencial e verificável, que será utilizado posteriormente por IAs responsáveis pela implementação do backend Django.
Quando identificar inconsistências, ambiguidades, riscos técnicos ou decisões que precisem ser confirmadas, NÃO corrija silenciosamente. Registre o problema claramente e indique em qual ponto da arquitetura ele ocorre.
As tarefas devem ser suficientemente específicas para que outra IA consiga executá-las sem precisar reinterpretar a arquitetura ou tomar decisões arquiteturais importantes por conta própria.
</regras_fixas>

<contexto>
O projeto é o backend Django/DRF do Aluguel360 Mobile.
A arquitetura do backend foi previamente definida em documentos separados por fases:
* django_fase1_fundacao.md
* django_fase2_models_banco.md
* django_fase3_api_views.md
* django_fase4_seguranca_deploy.md
Também existem documentos destinados às IAs que posteriormente implementarão o projeto:
* para ias/SKILL.md
* para ias/segredos_implementacao_projetos.md
* para ias/segredos_performance_nuvem.md
O arquivo SKILL.md contém regras comportamentais obrigatórias para as IAs implementadoras, incluindo:

* pensar antes de codificar;
* explicitar premissas;
* não assumir quando houver ambiguidades;
* simplicidade primeiro;
* alterações cirúrgicas;
* execução orientada por objetivos;
* critérios verificáveis de sucesso.

A pasta de destino do backend já foi criada:
backend/
Os documentos de arquitetura estão armazenados em:

auditorias_md/arquitetura_djando/

Os arquivos reais disponíveis no projeto devem ser considerados a referência concreta de localização. Não invente caminhos alternativos quando um caminho já estiver definido. </contexto>

<arquivos_base>
Leia integralmente antes de elaborar as tarefas:
1. Todos os documentos da arquitetura Django em:
   auditorias_md/arquitetura_djando/
2. SKILL.md em:
   mds/SKILL.md
3. segredos_implementacao_projetos.md em:
   mds/segredos_implementacao_projetos.md
4. segredos_performance_nuvem.md em:
   mds/segredos_performance_nuvem.md
Não comece a criar as tarefas após ler apenas um arquivo.
Primeiro compreenda a arquitetura completa e as relações entre as quatro fases.
</arquivos_base>

<protocolo_de_execucao>

1. Faça uma leitura completa de todos os arquivos-base.
2. Identifique:

   * fases;
   * subfases;
   * componentes;
   * apps Django;
   * arquivos envolvidos;
   * dependências entre tarefas;
   * dependências externas;
   * decisões arquiteturais;
   * requisitos de segurança;
   * requisitos de testes;
   * critérios de validação;
   * pontos que exigem aprovação humana.
3. Verifique se a sequência proposta pela arquitetura é executável.
4. Transforme a arquitetura em tarefas atômicas e executáveis.
5. Organize as tarefas hierarquicamente: Fase → Subfase → Tarefa → Subtarefa, quando necessário.
6. Ordene as tarefas considerando dependências reais. Uma tarefa que depende de outra nunca deve aparecer como executável antes de seu pré-requisito.
7. Cada tarefa deve possuir critérios objetivos de conclusão.
8. Ao final de cada fase, crie obrigatoriamente um CHECKPOINT.
9. A IA implementadora deve parar após concluir cada fase e executar o respectivo checkpoint.
10. O checkpoint NÃO deve apenas verificar se os arquivos existem. Deve verificar se a implementação atende aos requisitos arquiteturais, testes e critérios definidos.
11. Após o checkpoint de cada fase, a IA deve parar e refletir sobre a próxima fase antes de continuar.
12. A próxima fase NÃO deve ser iniciada automaticamente.
13. O documento deve deixar explícito: "Após concluir esta fase e seu checkpoint, PARE. Não avance para a próxima fase sem autorização explícita."
14. Caso uma tarefa revele uma necessidade que altere arquitetura, modelo de dados, contrato de API ou decisão estrutural, a IA deve parar e sinalizar o problema antes de continuar.
15. O plano deve permitir que uma IA diferente assuma o trabalho posteriormente sem perder o estado da implementação.
16. Não transforme o documento em uma explicação conceitual da arquitetura.
17. Não simplifique tarefas importantes apenas para reduzir o tamanho do documento.
</protocolo_de_execucao>

<instrucoes>
Crie um arquivo Markdown contendo as tarefas a serem cummpridas e seu chekpoint. Crie um segundo com a constituição para as IAs implementadoras. Sempre que elas precisarem devem consultar a constituição e os mds de fases.
Desenvolva todas as fases em ordem hierárquica.
Para cada FASE, informe:

### Objetivo da fase

Explique exatamente o que deverá estar funcionando ao final da fase.

### Pré-requisitos

Liste tudo que precisa estar disponível antes do início.

### Dependências

Informe dependências internas e externas relevantes.

### Tarefas

Divida a fase em tarefas numeradas hierarquicamente.

Para cada tarefa, informe obrigatoriamente:

* ID único;
* título;
* objetivo;
* contexto;
* arquivos/diretórios envolvidos;
* dependências;
* ações que a IA deve executar;
* decisões arquiteturais que devem ser respeitadas;
* critérios de conclusão;
* validações/testes necessários;
* resultado esperado.

Quando uma tarefa alterar um arquivo existente, informar o arquivo e o que deverá ser alterado.
Quando uma tarefa depender de uma implementação anterior, informar o ID da tarefa predecessora.
Quando houver modelos, endpoints, serializers, permissões, tasks Celery, configurações ou integrações externas, descrever suas responsabilidades e relações de forma suficientemente detalhada para evitar interpretação divergente pela IA implementadora.

### Checkpoint da fase

Ao final de cada fase, criar uma seção específica:
CHECKPOINT — FASE X

O checkpoint deve permitir responder objetivamente:
"Esta fase realmente está concluída?"

Depois do checkpoint, incluir obrigatoriamente:

> PARE.
>
> Não avance para a próxima fase.
>
> Revise o resultado da fase, verifique os critérios do checkpoint, identifique possíveis inconsistências ou efeitos sobre a próxima fase e aguarde autorização explícita para continuar.

### Ordem hierárquica

A organização final deve seguir uma estrutura semelhante a:

FASE 1
1.1 Subfase
1.1.1 Tarefa
1.1.1.1 Subtarefa

CHECKPOINT — FASE 1

FASE 2
2.1 Subfase
2.1.1 Tarefa

CHECKPOINT — FASE 2

FASE 3
...

FASE 4
...

A profundidade deve ser usada somente quando ajudar a tornar a implementação inequívoca.

### Matriz de dependências

Ao final do documento, crie uma matriz resumindo:

* ID da tarefa;
* tarefa predecessora;
* arquivos afetados;
* fase;
* pode executar em paralelo?;
* bloqueios.

Não force paralelismo quando houver dependência.

</instrucoes>

<restricoes_negativas>

2. NÃO substitua a arquitetura existente por uma arquitetura alternativa.

3. NÃO invente requisitos de negócio.

4. NÃO invente endpoints, modelos, campos ou regras que não estejam sustentados pela arquitetura.

6. NÃO assumir que duas partes da arquitetura são compatíveis quando os documentos não demonstram isso.

7. NÃO ocultar inconsistências encontradas.

8. NÃO criar tarefas genéricas como "implementar autenticação" ou "criar API". Decomponha-as em tarefas executáveis e verificáveis.

9. NÃO criar tarefas excessivamente granulares sem necessidade. O objetivo é detalhamento útil, não fragmentação artificial.

10. NÃO misturar tarefas de fases diferentes sem justificar a dependência.

11. NÃO permitir que uma IA implementadora avance automaticamente para outra fase.

12. NÃO considerar uma fase concluída apenas porque o código foi escrito.

13. NÃO remover testes ou validações para acelerar a implementação.

14. NÃO introduzir bibliotecas ou tecnologias alternativas à stack definida sem registrar a necessidade como pendência.

15. NÃO utilizar padrões legados quando já existe arquitetura mais atual.

16. NÃO gerar explicações extensas sobre conceitos que não sejam necessárias para executar as tarefas.

17. NÃO gerar um documento superficial.    O nível de detalhe deve ser suficiente para outra IA implementar a arquitetura sem precisar tomar decisões estruturais por conta própria.

18. NÃO gerar arquivos adicionais nesta etapa. O resultado solicitado é o documento de tarefas e a constituição.
    </restricoes_negativas>

<formato_de_saida>
Crie o arquivo:

mds/DJANGO_TASKS.md
mds/CONSTITUTION.md
</formato_de_saida>
