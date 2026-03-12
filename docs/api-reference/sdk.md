# Referência do SDK
API programática para integrar o SwiftHost em suas aplicações Node.js.

## Instalação
```bash
# Passo 01
git clone https://github.com/Shadw-Developer/swifthost.git

# Passo 02
cd swifthost && npm install 

# Passo 03
mv swift-host node_modules
```

Início Rápido

```typescript
import { deploy } from 'swifthost';

async function main() {
  const tunnel = await deploy('http://localhost:3000', {
    enableLogs: true,
    debug: false
  });

  console.log('URL pública:', tunnel.url);

  // Continua em execução até ser interrompido
  process.on('SIGINT', async () => {
    await tunnel.stop();
    process.exit(0);
  });
}

main();
```

## Referência da API
`deploy(targetUrl, options)`
Cria e inicia um novo túnel.

### Parâmetros
| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| **targetUrl** | `string` | Sim | URL do servidor local a ser exposta |
| **options** | `DeployOptions` | Não | Opções de configuração |

**Retorna:** `Promise<DeployResult>`

# DeployOptions
```typescript
interface DeployOptions {
  // Porta para o servidor proxy interno (padrão: auto 9000+)
  proxyPort?: number;

  // Suprimir a saída do console (padrão: true)
  quiet?: boolean;

  // Habilitar o registro de depuração (padrão: false)
  debug?: boolean;

  // Habilitar o registro de requisições no banco de dados (padrão: false)
  enableLogs?: boolean;

  // Subdomínio personalizado (requer conta paga do Cloudflare)
  subdomain?: string;

  // Tentativas de reconexão para criação do túnel (padrão: 3)
  retries?: number;
}
```

## DeployResult
```typescript
interface DeployResult {
  // URL HTTPS pública
  url: string;

  // Interromper o túnel normalmente
  stop(): Promise<void>;

  // Obter estatísticas atuais
  getStats(): ProxyStats;
}
```

# Uso Avançado
Manipulação de Eventos

```javascript
const tunnel = await deploy('http://localhost:3000');

// Acessar componentes internos
const { proxy, cloudflareTunnel } = tunnel;

proxy.on('request', (req) => {
  console.log(`Request: ${req.method} ${req.path}`);
});

cloudflareTunnel.on('log', (log) => {
  console.log(`[${log.level}] ${log.message}`);
});
```

Monitoramento de Saúde

```javascript
import { HealthMonitor } from 'swifthost/core/monitor';

const monitor = new HealthMonitor('http://localhost:3000', 5000);
  monitor.on('health', (status) => {
  console.log(`Health: ${status.isHealthy ? 'OK' : 'FAIL'} (${status.latency}ms)`);
});

monitor.start();
```
