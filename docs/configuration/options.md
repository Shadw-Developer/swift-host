# Opções de Configuração
Guia completo para configurar o comportamento do SwiftHost através de flags CLI, variáveis de ambiente e o SDK.

# Opções de CLI
Configuração de Portas
O SwiftHost utiliza um sistema de porta dupla: uma para o proxy interno e outra para o painel de controle (dashboard).

# Porta específica do proxy
```bash
swf http://localhost:3000 -p 9001

# Porta específica do dashboard
swf --gui 8888
```

# Prioridade de seleção de porta:
 * Flag --port explícita.
 * Variável de ambiente SWIFTHOST_PROXY_PORT.
 * Seleção automática no intervalo 9000-9999.

# Logs e Depuração
Ativar log de requisições
```bash
swf http://localhost:3000 -l

# Saída detalhada (Estado interno, detalhes do proxy, logs do túnel)
swf --debug
```

# Variáveis de Ambiente
Estas variáveis podem ser configuradas no seu terminal ou em um arquivo .env na raiz do projeto.

| Variável | Tipo | Padrão | Descrição |
|---|---|---|---|
| SWIFTHOST_DEBUG | boolean | false | Ativa o log de depuração |
| SWIFTHOST_LOG_LEVEL | string | info | Verbosidade do log (error, warn, info, debug) |
| SWIFTHOST_PROXY_PORT | number | 9000 | Porta padrão do proxy |
| SWIFTHOST_GUI_PORT | number | 7777 | Porta padrão do dashboard |
| SWIFTHOST_TUNNEL_TIMEOUT | number | 60000 | Tempo limite para criação do túnel (ms) |
| SWIFTHOST_DATABASE_PATH | string | ./database | Diretório de armazenamento de logs |

# Configuração do SDK
Ao usar o SwiftHost programaticamente, você passa um objeto DeployOptions para a função deploy.
```javascript
const tunnel = await deploy('http://localhost:3000', {
  proxyPort: 9001,      // Porta fixa ou seleção automática
  quiet: false,         // Exibir progresso no console
  debug: true,          // Logs internos detalhados
  enableLogs: true,     // Persistir requisições no disco
  retries: 5            // Tentativas em caso de falha no túnel
});
```

# Configurações Avançadas

Middleware de Proxy Personalizado
Você pode estender o EnhancedProxyServer para adicionar lógica personalizada, como autenticação ou manipulação de cabeçalhos.

```typescript
import { EnhancedProxyServer } from 'swifthost/core/enhanced-proxy';

const proxy = new EnhancedProxyServer(9000, 'http://localhost:3000', true);

proxy.app.use((req, res, next) => {
  res.setHeader('X-Custom-Header', 'SwiftHost');
  next();
});

await proxy.start();
```

# Ajuste de Performance (Tuning)

# Cenários de Alto Tráfego
Para testes semelhantes a produção com alto volume de requisições:
 * Desative os Logs: enableLogs: false para evitar gargalos de I/O de disco.
 * Aumente os Descritores de Arquivo: Certifique-se de que seu SO permite conexões abertas suficientes (ulimit -n 65535).
 * Memória: Garanta pelo menos 512MB de RAM para operação estável sob carga.

# Próximos Passos
 * Ajuste de Performance
 * Guia de Segurança
 * Solução de Problemas
