# Changelog

Todas as alterações notáveis no SwiftHost serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com),
e este projeto segue o [Semantic Versioning](https://semver.org).

## [ 1.2.0 ] - 2024-03-12

### Adicionado
- Dashboard web com métricas em tempo real (flag `--gui`)
- Log estruturado de requisições em arquivos JSON
- SDK para integração programática
- Suporte a TypeScript com definições de tipo completas
- Modo de reconexão automática (`swf dev`)
- Monitoramento de integridade com verificações de latência
- Suporte a WebSocket para atualizações em tempo real
- Seleção automática de porta quando a padrão estiver ocupada

### Alterado
- Reescrita completa em TypeScript
- Arquitetura modular com componentes de núcleo separados
- Tratamento e relatório de erros aprimorados
- Proxy aprimorado com rastreamento de largura de banda

### Corrigido
- Problemas de timeout em conexões lentas
- Vazamentos de memória em processos de longa duração
- Conflitos de vinculação de porta (port binding)

## [ 1.0.0 ] - 2024-01-15

### Adicionado
- Lançamento inicial
- Integração básica com túneis da Cloudflare
- Interface de linha de comando (CLI) com commander.js
- Proxy de requisição simples
- Modos de depuração (debug) e silencioso (quiet)
