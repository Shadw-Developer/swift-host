"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyServer = void 0;
const net_1 = require("net");
const events_1 = require("events");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const http_proxy_middleware_1 = require("http-proxy-middleware");
class ProxyServer extends events_1.EventEmitter {
    constructor(port, targetUrl) {
        super();
        this.requestCount = 0;
        this.bytesTransferred = 0;
        this.port = port;
        this.targetUrl = targetUrl;
        this.app = (0, express_1.default)();
        this.setupMiddleware();
    }
    setupMiddleware() {
        this.app.get('/__swifthost__/health', (req, res) => {
            res.json({
                status: 'ok',
                uptime: process.uptime(),
                requests: this.requestCount,
                target: this.targetUrl
            });
        });
        const proxyOptions = {
            target: this.targetUrl,
            changeOrigin: true,
            ws: true,
            logger: console,
            on: {
                error: (err, req, res) => {
                    this.emit('error', err);
                    if (res instanceof http_1.ServerResponse) {
                        if (!res.headersSent) {
                            res.writeHead(502, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                error: 'Bad Gateway',
                                message: 'Target server is unreachable',
                                swifthost: true,
                                timestamp: new Date().toISOString()
                            }));
                        }
                    }
                    else if (res instanceof net_1.Socket) {
                        res.destroy();
                    }
                },
                proxyReq: (proxyReq, req) => {
                    this.requestCount++;
                    this.emit('request', { method: req.method, url: req.url });
                },
                proxyRes: (proxyRes, req, res) => {
                    const contentLength = parseInt(proxyRes.headers['content-length'] || '0');
                    this.bytesTransferred += contentLength;
                    this.emit('response', {
                        statusCode: proxyRes.statusCode,
                        url: req.url,
                        bytes: contentLength
                    });
                }
            }
        };
        this.app.use('/', (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOptions));
    }
    async start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, '0.0.0.0', () => {
                this.emit('ready', { port: this.port });
                resolve();
            });
            this.server.on('error', (err) => {
                reject(err);
            });
        });
    }
    async stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    getStats() {
        return {
            requests: this.requestCount,
            bytesTransferred: this.bytesTransferred
        };
    }
}
exports.ProxyServer = ProxyServer;
//# sourceMappingURL=proxy.js.map