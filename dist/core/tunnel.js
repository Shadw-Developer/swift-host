"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareTunnel = void 0;
const events_1 = require("events");
const system_1 = require("../utils/system");
const child_process_1 = require("child_process");
class CloudflareTunnel extends events_1.EventEmitter {
    constructor(localPort, subdomain) {
        super();
        this.isRunning = false;
        this.localPort = localPort;
        this.subdomain = subdomain;
    }
    async start() {
        const cloudflaredPath = await (0, system_1.which)('cloudflared');
        if (!cloudflaredPath) {
            throw new Error('cloudflared não encontrado. Instale via:\n' +
                '  macOS: brew install cloudflared\n' +
                '  Linux: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/\n' +
                '  Windows: winget install Cloudflare.cloudflared');
        }
        return new Promise((resolve, reject) => {
            const args = [
                'tunnel',
                '--url', `http://localhost:${this.localPort}`,
                '--no-autoupdate'
            ];
            if (this.subdomain) {
                args.push('--hostname', this.subdomain);
            }
            this.process = (0, child_process_1.spawn)(cloudflaredPath, args, {
                stdio: ['ignore', 'pipe', 'pipe']
            });
            let stderr = '';
            let stdout = '';
            const timeout = setTimeout(() => {
                this.stop();
                reject(new Error('Timeout ao iniciar tunnel (60s). Verifique sua conexão ou se o cloudflared está funcionando.'));
            }, 60000);
            this.process.stdout?.on('data', (data) => {
                const output = data.toString();
                stdout += output;
                this.emit('log', { level: 'info', message: output });
                const match = output.match(/(https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/);
                if (match && !this.publicUrl) {
                    this.publicUrl = match[1];
                    this.isRunning = true;
                    clearTimeout(timeout);
                    resolve(this.publicUrl);
                }
                if (output.includes('Registered tunnel connection')) {
                    console.log('[Tunnel] Conexão registrada, aguardando URL...');
                }
            });
            this.process.stderr?.on('data', (data) => {
                const errOutput = data.toString();
                stderr += errOutput;
                this.emit('log', { level: 'error', message: errOutput });
                const match = errOutput.match(/(https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/);
                if (match && !this.publicUrl) {
                    this.publicUrl = match[1];
                    this.isRunning = true;
                    clearTimeout(timeout);
                    resolve(this.publicUrl);
                }
            });
            this.process.on('close', (code) => {
                this.isRunning = false;
                if (!this.publicUrl) {
                    clearTimeout(timeout);
                    reject(new Error(`cloudflared falhou (código ${code}).\nStdout: ${stdout}\nStderr: ${stderr}`));
                }
                this.emit('close', code);
            });
            this.process.on('error', (err) => {
                clearTimeout(timeout);
                reject(new Error(`Falha ao executar cloudflared: ${err.message}`));
            });
        });
    }
    stop() {
        if (this.process && !this.process.killed) {
            console.log('[Tunnel] Encerrando processo cloudflared...');
            this.process.kill('SIGTERM');
            setTimeout(() => {
                if (this.process && !this.process.killed) {
                    console.log('[Tunnel] Forçando kill...');
                    this.process.kill('SIGKILL');
                }
            }, 5000);
        }
        this.isRunning = false;
    }
    getUrl() {
        return this.publicUrl;
    }
    getStatus() {
        return this.isRunning;
    }
}
exports.CloudflareTunnel = CloudflareTunnel;
//# sourceMappingURL=tunnel.js.map