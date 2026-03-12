# Resolução de Problemas Comuns
Soluções para problemas encontrados frequentemente durante a instalação ou execução.

# Problemas de Instalação
cloudflared não encontrado

Erro:
```bash
❌ Erro: cloudflared não encontrado no PATH
```

## Soluções:
 * Verifique a instalação: Execute cloudflared --version.
 * Instale se estiver faltando:
   * macOS: brew install cloudflared
   * Linux: pkg install cloudflared ou baixe do GitHub.
   * Windows: winget install Cloudflare.cloudflared
 * Verifique o PATH: Certifique-se de que o diretório que contém o binário está no PATH do seu sistema.

## Problemas de Conexão
Timeout ao Criar o Túnel

Erro:
```bash
❌ Erro: Timeout ao iniciar tunnel (60s)
```

# Causas e Soluções:
 * Internet Lenta: Aumente o limite de tempo (timeout).
   ```bash
   export SWIFTHOST_TUNNEL_TIMEOUT=120000

   swf http://localhost:3000
   ```
 * Firewall: Certifique-se de que conexões de saída para *.trycloudflare.com estão permitidas.
 * Status do Serviço: Verifique cloudflarestatus.com.

# Servidor de Destino Não Encontrado

Erro:
```bash
❌ Erro: Não foi possível conectar a http://localhost:3000
```

# Soluções:
 * Verifique se o seu servidor local está realmente em execução.
 * Teste o acesso localmente: curl -I http://localhost:3000.
 * Verifique se você está usando a porta correta.

# Problemas em Tempo de Execução
Porta Já em Uso

Erro:
```bash
Error: listen EADDRINUSE: address already in use :::9000
```

# Solução:
O SwiftHost seleciona portas automaticamente por padrão. Se você vir isso ao usar uma flag específica -p, tente uma 

porta diferente:
```bash
swf http://localhost:3000 -p 9005
```

# Painel (Dashboard) Não Carrega
Sintomas: A página está em branco ou exibe um erro 404.

# Soluções:
 * Certifique-se de que iniciou com a flag --gui.
 * Verifique se outro processo está usando a porta 7777.
 * Recompile os assets (se em ambiente de dev): npm run build.

# Técnicas de Depuração
Habilitar Logs Detalhados
Sempre use a flag --debug para ver exatamente o que está acontecendo internamente:

```bash
swf --debug http://localhost:3000
```

# Verificar Logs
Se você habilitou o registro com -l ou --logs, verifique a pasta database/ em busca de arquivos JSON que possam conter detalhes sobre o erro.

# Obtendo Ajuda
Se o seu problema não estiver listado aqui:
 * Execute swf doctor para verificar a integridade do sistema.
 * Abra uma Issue no GitHub anexando a saída do comando swf --debug.
