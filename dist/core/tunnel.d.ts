import { EventEmitter } from 'events';
export declare class CloudflareTunnel extends EventEmitter {
    private process?;
    private publicUrl?;
    private readonly localPort;
    private readonly subdomain?;
    private isRunning;
    constructor(localPort: number, subdomain?: string);
    start(): Promise<string>;
    stop(): void;
    getUrl(): string | undefined;
    getStatus(): boolean;
}
//# sourceMappingURL=tunnel.d.ts.map