import { EventEmitter } from 'events';
export declare class EnhancedProxyServer extends EventEmitter {
    private app;
    private server?;
    readonly port: number;
    private targetUrl;
    private logger?;
    private requestCount;
    private bytesIn;
    private bytesOut;
    private uniqueIps;
    constructor(port: number, targetUrl: string, enableLogs?: boolean);
    private setupMiddleware;
    start(): Promise<void>;
    stop(): Promise<void>;
    getStats(): {
        requests: number;
        bytesIn: number;
        bytesOut: number;
        uniqueIps: number;
    };
}
//# sourceMappingURL=enhanced-proxy.d.ts.map