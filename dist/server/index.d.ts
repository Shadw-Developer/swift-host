export declare class DashboardServer {
    private app;
    private server;
    private wss;
    private logger;
    private tunnelManager;
    readonly port: number;
    constructor(port?: number);
    private setupMiddleware;
    private setupWebSocket;
    broadcast(data: any): void;
    start(): Promise<void>;
    stop(): void;
}
//# sourceMappingURL=index.d.ts.map