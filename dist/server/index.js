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
exports.DashboardServer = void 0;
const path = __importStar(require("path"));
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const routes_1 = require("./controllers/routes");
const tunnel_manager_1 = require("./controllers/tunnel-manager");
const WebSocketServer = require('ws').WebSocketServer;
const expressLayouts = require('express-ejs-layouts');
class DashboardServer {
    constructor(port = 7777) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        this.logger = new logger_1.RequestLogger();
        this.tunnelManager = new tunnel_manager_1.TunnelManager();
        this.setupMiddleware();
        this.setupWebSocket();
        (0, routes_1.setupRoutes)(this.app, this.logger, this.tunnelManager);
    }
    setupMiddleware() {
        this.app.set('view engine', 'ejs');
        const viewsPath = path.join(__dirname, '..', 'pages');
        this.app.set('views', viewsPath);
        this.app.use(expressLayouts);
        this.app.set('layout', 'layout');
        const publicPath = path.join(__dirname, '..', 'public');
        this.app.use(express_1.default.static(publicPath));
        this.app.use(express_1.default.json());
    }
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            const interval = setInterval(() => {
                const stats = this.tunnelManager.getAllStats();
                ws.send(JSON.stringify({ type: 'stats', data: stats }));
            }, 2000);
            ws.on('close', () => clearInterval(interval));
        });
    }
    broadcast(data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
        });
    }
    async start() {
        return new Promise((resolve) => {
            this.server.listen(this.port, () => {
                resolve();
            });
        });
    }
    stop() {
        this.server.close();
        this.wss.close();
    }
}
exports.DashboardServer = DashboardServer;
//# sourceMappingURL=index.js.map