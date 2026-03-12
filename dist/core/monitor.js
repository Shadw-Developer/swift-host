"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMonitor = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const events_1 = require("events");
class HealthMonitor extends events_1.EventEmitter {
    constructor(targetUrl, intervalMs = 5000) {
        super();
        this.targetUrl = targetUrl;
        this.interval = intervalMs;
    }
    start() {
        this.check();
        this.timer = setInterval(() => this.check(), this.interval);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    async check() {
        const start = Date.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        try {
            const response = await (0, node_fetch_1.default)(this.targetUrl, {
                method: 'HEAD',
                // @ts-ignore
                signal: controller.signal
            });
            const latency = Date.now() - start;
            this.lastStatus = {
                isHealthy: response.ok,
                latency,
                lastChecked: new Date()
            };
            this.emit('health', this.lastStatus);
        }
        catch (error) {
            this.lastStatus = {
                isHealthy: false,
                latency: Date.now() - start,
                lastChecked: new Date(),
                error: error.message
            };
            this.emit('health', this.lastStatus);
            this.emit('offline', this.lastStatus);
        }
        finally {
            clearTimeout(timeout);
        }
    }
    getStatus() {
        return this.lastStatus;
    }
}
exports.HealthMonitor = HealthMonitor;
//# sourceMappingURL=monitor.js.map