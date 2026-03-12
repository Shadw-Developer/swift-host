import { EventEmitter } from 'events';
export declare class ProxyServer extends EventEmitter {
    private app;
    private server?;
    readonly port: number;
    private targetUrl;
    private requestCount;
    private bytesTransferred;
    constructor(port: number, targetUrl: string);
    private setupMiddleware;
    start(): Promise<void>;
    stop(): Promise<void>;
    getStats(): {
        requests: number;
        bytesTransferred: number;
    };
}
//# sourceMappingURL=proxy.d.ts.map