# Diretrizes de Contribuição
Obrigado pelo seu interesse em contribuir para o SwiftHost! Este documento fornece instruções para configurar seu ambiente de desenvolvimento e enviar alterações.

# Configuração de Desenvolvimento

Pré-requisitos
 * Node.js: 16.0.0 ou superior
 * Git: Para controle de versão
 * cloudflared: Necessário para testar a funcionalidade de túnel localmente
Configuração Inicial

# 1. Faça um fork do repositório no GitHub
# 2. Clone o seu fork
```bash
# Passo 01
git clone https://github.com/Shadw-Developer/swifthost.git

# Passo 02
cd swifthost

# Passo 03
npm install

# Passo 04. Compile o projeto (Build)
npm run build

# Passo 05. Crie um link para testes locais
npm link
```

Estrutura do Projeto
 * bin/: Ponto de entrada da CLI.
 * src/core/: Lógica principal (Proxy, Túnel, Monitor de Saúde).
 * src/server/: Servidor Express do dashboard e rotas da API.
 * src/sdk/: API pública para uso programático.
 * src/pages/: Templates EJS para o dashboard.
 * database/: Diretório padrão para logs locais.

# Padrões de Código

TypeScript
 * Use PascalCase para classes e interfaces.
 * Use camelCase para variáveis e funções.
 * Sempre forneça tipos explícitos para parâmetros de função e valores de retorno.

# Mensagens de Commit
Seguimos um formato simplificado de Conventional Commits:
 * feat: Uma nova funcionalidade.
 * fix: Correção de bug.
 * docs: Alterações apenas na documentação.
 * refactor: Alterações de código que não corrigem bugs nem adicionam funcionalidades.

# Processo de Pull Request (PR)
 * Crie uma nova branch: git checkout -b feature/minha-nova-funcionalidade.
 * Faça suas alterações e garanta que elas sigam os padrões de código.
 * Teste suas alterações manualmente usando os comandos swf.
 * Envie para o seu fork: git push origin feature/minha-nova-funcionalidade.
 * Abra um Pull Request contra a branch main do repositório original.

# Testando Suas Alterações
Antes de enviar um PR, por favor verifique:
 * Build: npm run build termina sem erros.
 * CLI: O comando swf --help e o tunelamento básico funcionam.
 * Dashboard: O modo --gui carrega corretamente.
 * Doctor: O comando swf doctor relata que tudo está saudável.

# Dúvidas?
Se você tiver dúvidas ou precisar de orientação, sinta-se à vontade para abrir uma Issue com a tag question.

# Licença
Ao contribuir para o SwiftHost, você concorda que suas contribuições serão licenciadas sob a Licença MIT.
