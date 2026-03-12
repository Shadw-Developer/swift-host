"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedProxyServer = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class EnhancedProxyServer extends events_1.EventEmitter {
    constructor(port, targetUrl, enableLogs = false) {
        super();
        this.requestCount = 0;
        this.bytesIn = 0;
        this.bytesOut = 0;
        this.uniqueIps = new Set();
        this.port = port;
        this.targetUrl = targetUrl;
        this.app = (0, express_1.default)();
        if (enableLogs) {
            this.logger = new logger_1.RequestLogger();
        }
        this.setupMiddleware();
    }
    setupMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            const startTime = Date.now();
            const clientIp = req.headers['x-forwarded-for'] ||
                req.headers['x-real-ip'] ||
                req.socket.remoteAddress ||
                'unknown';
            const ip = Array.isArray(clientIp) ? clientIp[0] : clientIp;
            this.uniqueIps.add(ip);
            const originalWrite = res.write.bind(res);
            const originalEnd = res.end.bind(res);
            let responseBytes = 0;
            res.write = (chunk, ...args) => {
                responseBytes += chunk?.length || 0;
                return originalWrite(chunk, ...args);
            };
            res.end = (chunk, ...args) => {
                if (chunk)
                    responseBytes += chunk.length || 0;
                const duration = Date.now() - startTime;
                if (this.logger && !req.path.startsWith('/__swifthost__')) {
                    const headers = {};
                    if (req.headers['user-agent']) {
                        headers['user-agent'] = req.headers['user-agent'];
                    }
                    if (req.headers['accept']) {
                        headers['accept'] = req.headers['accept'];
                    }
                    if (req.headers['content-type']) {
                        headers['content-type'] = req.headers['content-type'];
                    }
                    this.logger.log({
                        ip: ip,
                        host: req.headers.host || 'unknown',
                        method: req.method,
                        path: req.url,
                        headers,
                        userAgent: req.headers['user-agent'],
                        referer: req.headers['referer'],
                        responseStatus: res.statusCode,
                        responseTime: duration,
                        bytesIn: parseInt(req.headers['content-length'] || '0'),
                        bytesOut: responseBytes
                    });
                }
                this.bytesOut += responseBytes;
                return originalEnd(chunk, ...args);
            };
            this.requestCount++;
            this.bytesIn += parseInt(req.headers['content-length'] || '0');
            this.emit('request', {
                id: `${Date.now()}-${Math.random()}`,
                ip,
                method: req.method,
                path: req.url,
                timestamp: new Date()
            });
            next();
        });
        this.app.get('/__swifthost__/health', (req, res) => {
            res.json({
                status: 'ok',
                uptime: process.uptime(),
                requests: this.requestCount,
                target: this.targetUrl,
                timestamp: new Date().toISOString()
            });
        });
        this.app.get('/__swifthost__/metrics', (req, res) => {
            res.json({
                requests: this.requestCount,
                bytesIn: this.bytesIn,
                bytesOut: this.bytesOut,
                uniqueIps: Array.from(this.uniqueIps),
                uptime: process.uptime()
            });
        });
        this.app.use('/', (0, http_proxy_middleware_1.createProxyMiddleware)({
            target: this.targetUrl,
            changeOrigin: true,
            ws: true,
        }));
        this.app.use((err, req, res, next) => {
            if (err && err.code === 'ECONNREFUSED') {
                this.emit('error', err);
                if (!res.headersSent) {
                    res.status(502).json({
                        error: 'Bad Gateway',
                        message: 'Target server is offline',
                        swifthost: true,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            else {
                next(err);
            }
        });
    }
    async start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, '0.0.0.0', () => {
                this.emit('ready', { port: this.port });
                resolve();
            });
            this.server.on('error', reject);
        });
    }
    async stop() {
        this.logger?.destroy();
        return new Promise((resolve) => {
            this.server?.close(() => resolve());
        });
    }
    getStats() {
        return {
            requests: this.requestCount,
            bytesIn: this.bytesIn,
            bytesOut: this.bytesOut,
            uniqueIps: this.uniqueIps.size
        };
    }
}
exports.EnhancedProxyServer = EnhancedProxyServer;
//# sourceMappingURL=enhanced-proxy.js.map