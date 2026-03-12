# Visão Geral da Arquitetura
O SwiftHost é construído sobre uma arquitetura modular que combina servidores proxy locais com a rede de borda (edge) global da Cloudflare.

# Arquitetura do Sistema
Fluxo de Conectividade:
 * Cliente: O navegador ou consumidor de API acessa via HTTPS.
 * Cloudflare Edge: A requisição é recebida pelo nó mais próximo da rede global.
 * Máquina Local:
   * O daemon cloudflared recebe o tráfego via túnel.
   * O SwiftHost Proxy recebe o tráfego HTTP e o encaminha.
   * O Seu Servidor Local processa a requisição final.
     
# Componentes Principais
 * Servidor Proxy (EnhancedProxyServer):
   O proxy HTTP local que reside entre o cloudflared e sua aplicação.
   * Responsabilidades: Encaminhamento de req/res, manipulação de cabeçalhos, suporte a WebSocket e coleta de métricas.
   * Recursos: Seleção automática de porta e rastreamento de largura de banda em tempo real.
 * Gerenciador de Túnel (CloudflareTunnel):
   Encapsula o processo CLI do cloudflared.
   * Responsabilidades: Iniciar o processo, capturar a URL pública do stdout e gerenciar o ciclo de vida e erros.
   * Timeout: Padrão de 60 segundos (configurável via SWIFTHOST_TUNNEL_TIMEOUT).
 * Monitor de Saúde (HealthMonitor):
   Valida a disponibilidade do servidor de destino antes de criar os túneis.
   * Ciclo: Realiza uma requisição HEAD a cada 2 segundos.
   * Verificações: Conexão TCP, medição de latência e retry automático com backoff.
 * Logger de Requisições (RequestLogger):
   Sistema de log estruturado para análise de requisições.
   * Estratégia de Rotação: Arquivos por hora no formato YYYY-MM-DD-HH.log.json.
   * Localização: ./database/.
 * Servidor do Dashboard (DashboardServer):
   Interface web em Express.js para gerenciamento do túnel.
   * Recursos: Atualizações em tempo real via WebSocket e templates EJS.

# Fluxo de Dados
Ciclo de Vida da Requisição
O caminho percorrido por uma requisição segue esta ordem:
Cliente ➔ Cloudflare Edge ➔ cloudflared ➔ SwiftHost Proxy ➔ App Local.
A resposta percorre o caminho inverso, com o Proxy registrando métricas antes de devolver os dados ao túnel.

## Pipeline de Log
As requisições passam por um middleware de proxy. Se os logs estiverem ativos, os dados são bufferizados e gravados em arquivos JSON a cada 5 segundos ou 100 entradas. Simultaneamente, as estatísticas são transmitidas via WebSocket para o Dashboard.

## Considerações de Segurança
 * Cabeçalhos de Requisição: Preserva X-Forwarded-For, CF-Connecting-IP (IP original do cliente) e CF-Ray (ID único da requisição).
 * Exposição Local: O proxy faz o bind em 0.0.0.0. Endpoints internos como /__swifthost__/health são usados para monitoramento.
 * Segurança do Túnel: Terminação TLS na borda da Cloudflare. HTTPS automático sem necessidade de gerenciar certificados locais.

# Características de Performance
| Métrica | Valor Típico |
|---|---|
| Criação do túnel | 5-30 segundos |
| Latência da requisição | +20-50ms (overhead do proxy) |
| Rendimento (Throughput) | Limitado pelo cloudflared |
| Conexões simultâneas | 100+ (Suporte a WebSocket) |
| Performance de escrita de log | 10.000 req/s (bufferizado) |

# Limites de Escalabilidade
 * Processo Único: Um túnel por instância CLI.
 * Descritores de Arquivo: Limitado pelo SO (padrão: 1024).
 * Memória: 50MB base + 1MB para cada 1000 conexões ativas.

# Próximos Passos
 * Referência da CLI
 * Documentação do SDK
 * Opções de Configuração
