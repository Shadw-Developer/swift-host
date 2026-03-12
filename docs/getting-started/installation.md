# Instalação

# Requisitos
 * Node.js: Versão 16.0.0 ou superior
 * cloudflared: Daemon de túnel da Cloudflare
 * Sistema Operacional: Linux, macOS ou Windows

# Instalando o Node.js
macOS
```bash
# Usando Homebrew
brew install node

# Ou usando nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

nvm install 20

nvm use 20
```

Linux (Ubuntu/Debian)
```bash
# Usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

sudo apt-get install -y nodejs

# Ou usando nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

nvm install 20

nvm use 20
```

Windows
```bash
# Usando winget
winget install OpenJS.NodeJS

# Ou baixe diretamente de nodejs.org
# https://nodejs.org/en/download/
```

# Instalando o cloudflared

macOS
```bash
brew install cloudflared
```

Linux

# Baixar a versão mais recente
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Instalar
sudo dpkg -i cloudflared.deb
```

# ARM/Termux
```bash
pkg install cloudflared
```

# Windows
```bash
winget install --id Cloudflare.cloudflared
```

# Verifique a instalação:
```bash
cloudflared --version
```

# Instalando o SwiftHost
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

# Saída esperada:
```
🔍 SwiftHost Doctor

✓ Node.js >= 16
✓ cloudflared CLI
✓ Diretório database/

✓ Sistema pronto para uso!
```

# Próximos Passos
 * Guia de Início Rápido
 * Comandos da CLI
 * Integração com SDK
