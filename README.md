<p align="center">
  <img src="docs/assets/logo.png" alt="SwiftHost Logo" width="200" />
</p>

<p align="center">
  <strong>Exponha servidores locais à internet instantaneamente, com analytics avançados e dashboard web.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2.0-blue.svg" alt="version">
  <img src="https://img.shields.io/badge/downloads-coming_soon-lightgrey.svg" alt="downloads">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  <img src="https://img.shields.io/badge/node-v24.13.0-green.svg" alt="node version">
</p>

<p align="center">
  <a href="#-recursos">Recursos</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-uso-rápido">Uso rápido</a> •
  <a href="#-comandos">Comandos</a> •
  <a href="#-dashboard">Dashboard</a> •
  <a href="#-documentação">Documentação</a> •
  <a href="#-contribuição">Contribuição</a>
</p>

---

## ✨ Recursos

* **Túneis instantâneos** com Cloudflare — seu localhost vira uma URL pública `*.trycloudflare.com`.
* **Proxy reverso inteligente** com logging detalhado de todas as requisições.
* **Dashboard web** em tempo real para monitorar tunnels, tráfego e estatísticas.
* **Logs persistentes** salvos em `database/` — consulte requisições antigas com `swf logs`.
* **Modo desenvolvedor** com auto‑reconnect e debug detalhado.
* **API programática (SDK)** para integrar tunnels em suas próprias ferramentas.
* **Comando `doctor`** para verificar a integridade do ambiente.
* **Totalmente open source** e extensível.

---

## 📦 Instalação

Instalação Global (Recomendado)

```bash
# Passo 01
git clone https://github.com/Shadw-Developer/swifthost.git

# Passo 02
cd swifthost

# Passo 03
npm install

# Passo 04
npm link && npm i -g .
```

# Instalação para Desenvolvimento
clone este repositório
```bash
git clone https://github.com/Shadw-Developer/swifthost.git
```

entre na pasta do projeto e instale as dependências.

```bash
cd swifthost && npm install
```

# Verificação
Execute o comando doctor para verificar se tudo está configurado corretamente:

```bash
# Se estiver instalado globalmente
swf doctor

# Se estiver apenas clonado o repositório para um projeto já existente.
node swifthost/dist/index.js doctor
```

📋 Pré‑requisitos
 * Node.js: v18.0.0 ou superior.
 * cloudflared: Instalado e disponível no seu PATH.
   > O comando swf doctor verifica isso automaticamente para você.

## ⚡ Uso Rápido
Exponha seu servidor local (ex: app Next.js, API Express) em segundos:
swf http://localhost:3000

Após o comando, você receberá uma URL pública (ex: https://seu-tunnel.trycloudflare.com). Todas as requisições serão encaminhadas para o seu localhost:3000.

## Opções Comuns
| Flag | Descrição |
|---|---|
| -u, --url | URL do servidor local (Padrão: http://localhost:3000) |
| -p, --port | Porta do proxy interno (Padrão: 9000+) |
| -l, --logs | Habilita persistência de logs em database/ |
| -d, --debug | Exibe logs detalhados do proxy e tunnel |
| -q, --quiet | Modo silencioso (imprime apenas a URL pública) |
| -g, --gui | Inicia o dashboard web diretamente |

## 🧰 Comandos
| Comando | Descrição |
|---|---|
| swf [url] | Cria um túnel para a URL especificada. |
| swf gui | Inicia o dashboard web (Padrão: porta 7777). |
| swf dev | Modo desenvolvimento com auto‑reconnect. |
| swf logs | Exibe os últimos logs de requisições no terminal. |
| swf doctor | Verifica se o ambiente está configurado corretamente. |
| swf help | Mostra a lista completa de ajuda. |

## 🖥️ Dashboard
O SwiftHost inclui uma interface visual para gerenciar múltiplos túneis e visualizar estatísticas de tráfego.
swf gui

Acesse http://localhost:7777 para visualizar:
 * Status de saúde dos túneis ativos.
 * Gráficos de requisições por hora.
 * Análise de IPs e caminhos (paths) mais acessados.
 * Logs detalhados com filtros de busca.

<p align="center">
  <img src="docs/assets/dashboard-preview.png" alt="Dashboard preview" width="80%" />
</p>

## 🧪 Exemplos de Uso
**1. Expor app React com logs ativos** <br>
```bash
swf http://localhost:3000 -l
```

**2. Uso Programático (SDK)** <br>
```typescript
import { deploy } from 'swifthost';

(async () => {
  const tunnel = await deploy('http://localhost:8080', {
    enableLogs: true,
    debug: true
  });

  console.log(`URL pública: ${tunnel.url}`);

  // Para encerrar o túnel:
  // await tunnel.stop();
})();
```

## 3. Filtrar logs por IP
```bash
swf logs --ip 192.168.1.10 --lines 20
```

## 🤝 Contribuição
Contribuições tornam a comunidade open source um lugar incrível!
 * Faça um Fork do projeto.
 * Crie uma Branch (git checkout -b feature/NovaFeature).
 * Dê um Commit nas mudanças (git commit -m 'feat: Adiciona nova funcionalidade').
 * Faça um Push (git push origin feature/NovaFeature).
 * Abra um Pull Request.
   
## 📄 Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](https://github.com/Shadw-Developer/swifthost/edit/main/LICENSE) para mais detalhes.

<p align="center">
  Feito com ❤️ por <a href="https://github.com/Shadw-Developer">Alisson</a>.
</p>
