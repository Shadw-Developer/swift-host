#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
const commander_1 = require("commander");
const portfinder_1 = __importDefault(require("portfinder"));
const deploy_1 = require("./sdk/deploy");
const logger_1 = require("./utils/logger");
const server_1 = require("./server");
const dashboard_1 = require("./ui/dashboard");
const monitor_1 = require("./core/monitor");
const tunnel_1 = require("./core/tunnel");
const enhanced_proxy_1 = require("./core/enhanced-proxy");
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const program = new commander_1.Command();
program.configureHelp({
    helpWidth: 80,
    sortSubcommands: true,
    showGlobalOptions: true
});
program
    .name('swf')
    .description('SwiftHost - Expose local servers to the internet with advanced analytics')
    .version(packageJson.version, '-v, --version', 'Exibe versão atual')
    .helpOption('-h, --help', 'Exibe ajuda detalhada')
    .addHelpCommand('help [command]', 'Exibe ajuda para um comando específico');
program
    .argument('[target]', 'URL ou path do projeto local', 'http://localhost:3000')
    .option('-u, --url <string>', 'URL do servidor local (alternativa ao argumento posicional)')
    .option('-p, --port <number>', 'Porta interna do proxy', (val) => parseInt(val))
    .option('-d, --debug', 'Modo debug com logs detalhados', false)
    .option('-q, --quiet', 'Modo silencioso - só imprime a URL', false)
    .option('-l, --logs', 'Habilita logging de requests para database/', false)
    .option('-g, --gui [port]', 'Inicia dashboard web de gerenciamento', false)
    .option('--subdomain <string>', 'Subdomain personalizado (requer conta Cloudflare paga)')
    .action(async (target, options) => {
    const targetUrl = options.url || target;
    if (options.gui !== false) {
        const guiPort = typeof options.gui === 'string' ? parseInt(options.gui) : 7777;
        console.log(chalk_1.default.cyan(logger_1.banner));
        const server = new server_1.DashboardServer(guiPort);
        await server.start();
        console.log(chalk_1.default.green(`\n✅ Dashboard rodando em http://localhost:${guiPort}`));
        console.log(chalk_1.default.dim('\nPressione Ctrl+C para parar o servidor\n'));
        process.on('SIGINT', () => {
            console.log(chalk_1.default.yellow('\n🛑 Encerrando dashboard...'));
            server.stop();
            process.exit(0);
        });
        await new Promise(() => { });
        return;
    }
    if (!options.quiet) {
        console.log(chalk_1.default.cyan(logger_1.banner));
    }
    try {
        const proxyPort = options.port || await portfinder_1.default.getPortPromise({ port: 9000 });
        const dashboard = new dashboard_1.Dashboard(options.quiet, options.debug);
        dashboard.startLoading(`Verificando ${targetUrl}...`);
        const { which } = await Promise.resolve().then(() => __importStar(require('./utils/system')));
        const hasCloudflared = await which('cloudflared');
        if (!hasCloudflared) {
            throw new Error('cloudflared não encontrado no PATH. Instale: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/');
        }
        const monitor = new monitor_1.HealthMonitor(targetUrl, 2000);
        await new Promise((resolve, reject) => {
            monitor.once('health', (status) => {
                if (status.isHealthy)
                    resolve(status);
                else
                    reject(new Error('Target não responde'));
            });
            monitor.start();
            setTimeout(() => reject(new Error('Timeout')), 5000);
        });
        dashboard.succeed('Target online');
        dashboard.startLoading(`Iniciando proxy na porta ${proxyPort}...`);
        const proxy = new enhanced_proxy_1.EnhancedProxyServer(proxyPort, targetUrl, options.logs);
        if (options.debug) {
            proxy.on('request', (req) => {
                console.log(chalk_1.default.gray(`[Proxy] ${req.method} ${req.path}`));
            });
            proxy.on('error', (err) => {
                console.log(chalk_1.default.red(`[Proxy Error] ${err.message}`));
            });
        }
        await proxy.start();
        dashboard.succeed(`Proxy ativo${options.logs ? ' (logs habilitados)' : ''}`);
        dashboard.startLoading('Iniciando tunnel Cloudflare...');
        console.log(chalk_1.default.dim('(Isso pode levar até 60 segundos...)'));
        const tunnel = new tunnel_1.CloudflareTunnel(proxyPort, options.subdomain);
        if (options.debug) {
            tunnel.on('log', (log) => {
                if (log.level === 'error') {
                    console.log(chalk_1.default.red(`[Tunnel] ${log.message.trim()}`));
                }
                else {
                    console.log(chalk_1.default.gray(`[Tunnel] ${log.message.trim()}`));
                }
            });
        }
        const publicUrl = await tunnel.start();
        dashboard.succeed('Tunnel conectado');
        if (!options.quiet) {
            dashboard.showBanner({
                publicUrl,
                localUrl: targetUrl,
                proxyPort,
                metrics: {
                    requests: 0,
                    startTime: new Date(),
                    bytesTransferred: 0
                }
            });
            console.log(chalk_1.default.dim('\nPressione Ctrl+C para encerrar\n'));
            if (options.logs) {
                console.log(chalk_1.default.blue('💾 Logs sendo salvos em database/'));
            }
        }
        else {
            console.log(publicUrl);
        }
        const cleanup = async () => {
            if (!options.quiet)
                console.log(chalk_1.default.yellow('\n\n🛑 Encerrando SwiftHost...'));
            monitor.stop();
            tunnel.stop();
            await proxy.stop();
            process.exit(0);
        };
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        await new Promise(() => { });
    }
    catch (error) {
        const dashboard = new dashboard_1.Dashboard(options.quiet, options.debug);
        dashboard.showError(error.message);
        process.exit(1);
    }
});
program
    .command('gui')
    .description('Inicia servidor web de gerenciamento de tunnels')
    .option('-p, --port <number>', 'Porta do dashboard', '7777')
    .action(async (options) => {
    const port = parseInt(options.port);
    const server = new server_1.DashboardServer(port);
    await server.start();
    console.log(chalk_1.default.green(`Dashboard ativo em http://localhost:${port}`));
    process.on('SIGINT', () => {
        server.stop();
        process.exit(0);
    });
    await new Promise(() => { });
});
program
    .command('dev')
    .description('Modo desenvolvimento com auto-reconnect e watch')
    .argument('[target]', 'URL do servidor', 'http://localhost:3000')
    .option('-p, --port <number>', 'Porta do proxy')
    .option('-l, --logs', 'Habilita logging', true)
    .action(async (target, options) => {
    console.log(chalk_1.default.cyan('🔥 Modo Dev iniciado (auto-reconnect ativo)\n'));
    let current = null;
    let isShuttingDown = false;
    const cleanup = async () => {
        if (isShuttingDown)
            return;
        isShuttingDown = true;
        if (current)
            await current.stop();
        process.exit(0);
    };
    process.on('SIGINT', cleanup);
    const start = async () => {
        try {
            if (current)
                await current.stop();
            current = await (0, deploy_1.deploy)(target, {
                proxyPort: options.port,
                quiet: false,
                debug: true,
                enableLogs: options.logs
            });
            console.log(chalk_1.default.green(`\n🌐 ${current.url}`));
            setInterval(async () => {
                try {
                    const res = await fetch(current.url);
                    if (!res.ok)
                        throw new Error('Unhealthy');
                }
                catch {
                    console.log(chalk_1.default.yellow('\n⚠️ Reconectando...'));
                    setTimeout(start, 2000);
                }
            }, 10000);
        }
        catch (err) {
            console.log(chalk_1.default.red(`Erro: ${err.message}`));
            setTimeout(start, 5000);
        }
    };
    await start();
});
program
    .command('doctor')
    .description('Verifica se o ambiente está configurado corretamente')
    .action(async () => {
    const { which } = await Promise.resolve().then(() => __importStar(require('./utils/system')));
    console.log(chalk_1.default.cyan('🔍 SwiftHost Doctor\n'));
    const checks = [
        {
            name: 'Node.js >= 16',
            check: () => parseInt(process.version.slice(1)) >= 16
        },
        {
            name: 'cloudflared CLI',
            check: async () => !!(await which('cloudflared'))
        },
        {
            name: 'Diretório database/',
            check: () => {
                try {
                    require('fs').mkdirSync('database', { recursive: true });
                    return true;
                }
                catch {
                    return false;
                }
            }
        }
    ];
    let allOk = true;
    for (const item of checks) {
        const ok = await item.check();
        const icon = ok ? chalk_1.default.green('✓') : chalk_1.default.red('✗');
        console.log(`${icon} ${item.name}`);
        if (!ok)
            allOk = false;
    }
    if (!allOk) {
        console.log(chalk_1.default.yellow('\n⚠️  Alguns problemas foram detectados.'));
        console.log(chalk_1.default.dim('\nInstale cloudflared:'));
        console.log('  macOS: brew install cloudflared');
        console.log('  Linux: curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared.deb');
        console.log('  Windows: winget install Cloudflare.cloudflared');
    }
    else {
        console.log(chalk_1.default.green('\n✓ Sistema pronto para uso!'));
    }
});
program
    .command('logs')
    .description('Visualiza logs recentes no terminal')
    .option('-n, --lines <number>', 'Número de linhas', '50')
    .option('--ip <ip>', 'Filtrar por IP')
    .option('--path <path>', 'Filtrar por path')
    .action(async (options) => {
    const { RequestLogger } = await Promise.resolve().then(() => __importStar(require('./utils/logger')));
    const logger = new RequestLogger();
    const logs = await logger.query({
        limit: parseInt(options.lines),
        ip: options.ip,
        path: options.path
    });
    console.log(chalk_1.default.cyan(`\nÚltimos ${logs.length} requests:\n`));
    logs.forEach(log => {
        const time = chalk_1.default.dim(new Date(log.timestamp).toLocaleTimeString());
        const method = chalk_1.default.blue(log.method.padEnd(6));
        const status = log.responseStatus === 200
            ? chalk_1.default.green(log.responseStatus)
            : chalk_1.default.red(log.responseStatus || '-');
        const path = chalk_1.default.white(log.path);
        const ip = chalk_1.default.gray(log.ip);
        console.log(`${time} ${method} ${status} ${path} ${ip}`);
    });
    logger.destroy();
});
program.parse();
if (process.argv.length === 2) {
    program.help();
}
//# sourceMappingURL=index.js.map