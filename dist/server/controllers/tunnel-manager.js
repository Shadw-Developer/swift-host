"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunnelManager = void 0;
const events_1 = require("events");
const deploy_1 = require("../../sdk/deploy");
class TunnelManager extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.tunnels = new Map();
    }
    async create(targetUrl, options = {}) {
        const tunnel = await (0, deploy_1.deploy)(targetUrl, {
            ...options,
            quiet: true
        });
        const session = {
            id: Math.random().toString(36).substring(7),
            publicUrl: tunnel.url,
            localUrl: targetUrl,
            proxyPort: options.proxyPort || 0,
            startTime: new Date(),
            status: 'active',
            metrics: {
                totalRequests: 0,
                totalBytesIn: 0,
                totalBytesOut: 0,
                uniqueIps: new Set()
            },
            logs: []
        };
        this.tunnels.set(session.id, { session, controller: tunnel });
        this.emit('created', session);
        return session;
    }
    stop(id) {
        const tunnel = this.tunnels.get(id);
        if (tunnel) {
            tunnel.controller.stop();
            tunnel.session.status = 'closed';
            this.tunnels.delete(id);
            this.emit('stopped', id);
        }
    }
    getAll() {
        return Array.from(this.tunnels.values()).map(t => ({
            ...t.session,
            metrics: {
                ...t.session.metrics,
                uniqueIps: t.session.metrics.uniqueIps.size
            }
        }));
    }
    getAllStats() {
        return {
            tunnels: this.getAll(),
            count: this.tunnels.size
        };
    }
}
exports.TunnelManager = TunnelManager;
//# sourceMappingURL=tunnel-manager.js.map