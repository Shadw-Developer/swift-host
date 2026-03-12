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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServer = exports.RequestLogger = exports.Dashboard = exports.HealthMonitor = exports.CloudflareTunnel = exports.EnhancedProxyServer = void 0;
exports.deploy = deploy;
const enhanced_proxy_1 = require("../core/enhanced-proxy");
const tunnel_1 = require("../core/tunnel");
const monitor_1 = require("../core/monitor");
const dashboard_1 = require("../ui/dashboard");
const portfinder_1 = __importDefault(require("portfinder"));
async function deploy(targetUrl, options = {}) {
    const config = {
        targetUrl,
        proxyPort: options.proxyPort || await portfinder_1.default.getPortPromise({ port: 9000 }),
        quiet: options.quiet ?? true,
        debug: options.debug ?? false,
        enableLogs: options.enableLogs ?? false,
        subdomain: options.subdomain,
        retries: options.retries || 3
    };
    const dashboard = new dashboard_1.Dashboard(config.quiet, config.debug);
    dashboard.startLoading(`Verificando ${targetUrl}...`);
    const monitor = new monitor_1.HealthMonitor(targetUrl, 2000);
    try {
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
    }
    catch (err) {
        dashboard.fail('Target offline');
        monitor.stop();
        throw new Error(`Não foi possível conectar a ${targetUrl}`);
    }
    dashboard.startLoading(`Iniciando proxy...`);
    const proxy = new enhanced_proxy_1.EnhancedProxyServer(config.proxyPort, targetUrl, config.enableLogs);
    await proxy.start();
    dashboard.succeed('Proxy ativo');
    dashboard.startLoading('Conectando ao Cloudflare...');
    const tunnel = new tunnel_1.CloudflareTunnel(config.proxyPort, config.subdomain);
    const publicUrl = await tunnel.start();
    dashboard.succeed('Tunnel pronto');
    if (!config.quiet) {
        dashboard.showBanner({
            publicUrl,
            localUrl: targetUrl,
            proxyPort: config.proxyPort,
            metrics: {
                requests: 0,
                startTime: new Date(),
                bytesTransferred: 0
            }
        });
    }
    return {
        url: publicUrl,
        stop: async () => {
            monitor.stop();
            tunnel.stop();
            await proxy.stop();
        },
        getStats: () => proxy.getStats()
    };
}
var enhanced_proxy_2 = require("../core/enhanced-proxy");
Object.defineProperty(exports, "EnhancedProxyServer", { enumerable: true, get: function () { return enhanced_proxy_2.EnhancedProxyServer; } });
var tunnel_2 = require("../core/tunnel");
Object.defineProperty(exports, "CloudflareTunnel", { enumerable: true, get: function () { return tunnel_2.CloudflareTunnel; } });
var monitor_2 = require("../core/monitor");
Object.defineProperty(exports, "HealthMonitor", { enumerable: true, get: function () { return monitor_2.HealthMonitor; } });
var dashboard_2 = require("../ui/dashboard");
Object.defineProperty(exports, "Dashboard", { enumerable: true, get: function () { return dashboard_2.Dashboard; } });
var logger_1 = require("../utils/logger");
Object.defineProperty(exports, "RequestLogger", { enumerable: true, get: function () { return logger_1.RequestLogger; } });
var server_1 = require("../server");
Object.defineProperty(exports, "DashboardServer", { enumerable: true, get: function () { return server_1.DashboardServer; } });
__exportStar(require("../types"), exports);
//# sourceMappingURL=deploy.js.map