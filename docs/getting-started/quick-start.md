# Guia de Início Rápido
Este guia o ajudará a expor seu primeiro servidor local para a internet usando o SwiftHost.
Uso Básico

## 1. Inicie seu Servidor Local
Primeiro, certifique-se de que seu servidor de desenvolvimento local esteja rodando:
```bash
# Exemplo: Servidor de desenvolvimento Vite

npm run dev

# Saída: http://localhost:3000
```

## 2. Crie um Túnel
Em uma nova janela do terminal, execute o SwiftHost:
```bash
swf http://localhost:3000
```

Ou simplesmente:

```bash
swf

# O padrão é http://localhost:3000
```

## 3. Acesse sua URL Pública
O SwiftHost exibirá sua URL pública no terminal:
```
✔ Target online
✔ Proxy ativo
✔ Tunnel conectado

🚀 SwiftHost Tunnel Ativo

Público:  https://abc123-def456.trycloudflare.com
Local:    http://localhost:3000
Proxy:    Porta 9000

Pressione Ctrl+C para encerrar
```

Seu servidor local agora está acessível em todo o mundo!
Cenários Comuns

## Porta Diferente
```bash
swf http://localhost:8080
```

## Com Registro de Logs (Logging)

```bash
swf http://localhost:3000 --logs

# Logs salvos em database/2026-03-12-14.log.json
```

Modo Silencioso (para scripts)

```bash
swf -q

# Saída: https://abc123-def456.trycloudflare.com
```

## Com Saída de Debug
```bash
swf --debug

# Mostra logs detalhados do proxy e do túnel
```

## Painel Web (Dashboard)
Inicie o painel de gerenciamento para uma visão visual:

```bash
swf --gui

# ou

swf gui --port 8888
```

Acesse em http://localhost:7777 para:
 * Monitorar túneis ativos.
 * Visualizar requisições em tempo real.
 * Analisar padrões de tráfego.
 * Gerenciar múltiplos endpoints.

# Integração com SDK
Use o SwiftHost programaticamente em suas aplicações Node.js:

```typescript
import { deploy } from 'swifthost';

const tunnel = await deploy('http://localhost:3000', {
  enableLogs: true,
  debug: false
});

console.log('URL Pública:', tunnel.url);

// Obter estatísticas
console.log(tunnel.getStats());

// Parar quando terminar
await tunnel.stop();
```

# Próximos Passos
 * Conheça as Opções da CLI
 * Explore a API do SDK
 * Configurações Avançadas
