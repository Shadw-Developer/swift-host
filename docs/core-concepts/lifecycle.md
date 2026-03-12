# Ciclo de Vida da Aplicação
Entenda como o SwiftHost gerencia o ciclo de vida dos túneis e das conexões.

# Sequência de Inicialização
## Fase 1: Análise de Argumentos (0ms)
 * Analisa as flags e argumentos da CLI.
 * Resolve a URL de destino (padrão: http://localhost:3000).
 * Configura os modos de log e depuração (debug).
## Fase 2: Validação do Alvo (0-5000ms)
 * Verificação de conexão TCP na porta de destino.
 * Requisição HTTP HEAD para confirmação de integridade.
 * Tempo limite (timeout): 5 segundos.
## Fase 3: Inicialização do Proxy (10-100ms)
 * Criação da aplicação Express.
 * Configuração da pilha de middlewares.
 * Vinculação (bind) a uma porta disponível.
 * Inicialização do servidor HTTP.
## Fase 4: Criação do Túnel (5000-60000ms)
 * Verifica se o binário cloudflared existe.
 * Inicia o subprocesso com os argumentos necessários.
 * Analisa o stdout para capturar a URL pública.
 * Tempo limite: 60 segundos.
## Fase 5: Estado Pronto
 * Exibe o banner de conexão.
 * Inicia tarefas em segundo plano (logs, métricas).
 * Entra no loop de manutenção (keep-alive).

# Estado de Execução (Runtime)
Durante a operação normal, o SwiftHost mantém:
 * Servidor HTTP: Manipulando requisições de entrada.
 * Log Flusher: Limpeza periódica do buffer de logs (intervalo de 5s).
 * Servidor WebSocket (modo dashboard): Transmitindo estatísticas.
 * Manipuladores de Sinais: Escuta SIGINT e SIGTERM para encerramento gracioso.

# Sequência de Encerramento
Encerramento Gracioso (SIGINT/SIGTERM)
 * Usuário envia Ctrl+C ou sinal de sistema.
 * SwiftHost para de aceitar novas conexões.
 * Túnel é encerrado (processo cloudflared).
 * Logger grava os logs restantes no disco.
 * Aplicação finaliza com Exit 0.

# Tratamento de Timeout
Se o encerramento gracioso exceder 10 segundos:
 * O processo cloudflared é forçado a encerrar (SIGKILL).
 * O servidor HTTP é fechado imediatamente.
 * Logs não gravados são descartados e a aplicação sai com erro.

# Recuperação de Erros

| Tipo de Erro | Estratégia de Recuperação |
|---|---|
| Alvo (Target) offline | Saída imediata com erro |
| Porta em uso | Seleção automática de porta alternativa |
| Timeout do túnel | Nova tentativa com backoff exponencial |
| Crash do cloudflared | Saída com mensagem de diagnóstico |
| Erro no Proxy | Registra o log e continua a operação |

# Reconexão Automática (Modo Dev)
Se a conexão for perdida e o modo de desenvolvimento estiver ativo, o SwiftHost aguarda 5 segundos e tenta criar um novo túnel automaticamente, repetindo o processo até obter sucesso ou ser interrompido manualmente.

# Gerenciamento de Memória
Para evitar vazamentos de memória (memory leaks) e garantir estabilidade:
 * Buffer de Logs: Limpeza a cada 100 entradas ou 5 segundos.
 * Escrita em Arquivo: Baseada em streams para evitar acúmulo de dados na RAM.
 * Limpeza de Eventos: Remoção de referências circulares e encerramento de todos os setInterval e setTimeout ao parar.

# Próximos Tópicos
 * Tratamento de Erros
 * Ajuste de Performance (Tuning)
