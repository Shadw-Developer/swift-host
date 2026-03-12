# Painel Web (Web Dashboard)
O Painel do SwiftHost oferece uma interface web em tempo real para monitorar e gerenciar seus túneis.

# Iniciando o Painel

como parte da criação de um túnel
```bash
swf http://localhost:3000 --gui

# Ou de forma independente
# forma 01
swf gui

# forma 02
swf gui -p 8888  # Porta personalizada
```

# Visão Geral da Interface
O painel é estruturado para fornecer visibilidade total sobre o tráfego e o status do sistema:
 * UI do Painel: Organiza cartões de estatísticas, lista de túneis, requisições recentes, principais endpoints e linha do tempo de tráfego.
 * Atualizações em Tempo Real: Utiliza WebSockets para transmitir estatísticas ao vivo e o fluxo de requisições sem necessidade de recarregar a página.

# Páginas
## Painel Principal (/)
Visão geral principal que exibe:
 * Cartões de Estatísticas: Túneis ativos, total de requisições, arquivos de log e armazenamento utilizado.
 * Túneis Ativos: Lista contendo a URL pública, o destino local e a contagem de requisições.
 * Requisições Recentes: As últimas 50 requisições com registro de data/hora (timestamp), IP, método, caminho e status.

## Análise (/analytics)
Análise detalhada de tráfego:
 * Principais Endpoints: Caminhos mais acessados com gráficos de barras.
 * Visitantes Únicos: Contagem de endereços IP distintos.
 * Linha do Tempo de Tráfego: Visualização do volume de requisições por hora.

## Atualizações em Tempo Real
O painel utiliza conexões WebSocket para enviar atualizações ao vivo:
 * Novas requisições aparecem instantaneamente.
 * Mudanças no status do túnel são refletidas imediatamente.
 * Contadores de estatísticas possuem animação ao serem atualizados.

## Endpoints da API
O painel expõe endpoints REST para integração com outras ferramentas:

| Endpoint | Método | Descrição |
|---|---|---|
| /api/tunnels | GET | Listar todos os túneis ativos |
| /api/tunnels | POST | Criar um novo túnel programaticamente |
| /api/tunnels/:id | DELETE | Parar um túnel específico |
| /api/logs | GET | Consultar logs com filtros (limite, IP, caminho) |
| /api/stats | GET | Estatísticas globais atuais |

## Considerações de Segurança
> [!WARNING]
> Aviso: O painel vincula-se ao endereço 0.0.0.0 (todas as interfaces) por padrão.
> 

## Para um uso seguro:
 * Vincule apenas ao localhost se não precisar de acesso remoto.
 * Use regras de firewall para restringir o acesso à porta do painel (padrão 7777).
 * Esteja ciente de que qualquer pessoa com acesso ao painel pode gerenciar seus túneis.

## Próximos Passos
 * Referência da CLI
 * Referência da API
