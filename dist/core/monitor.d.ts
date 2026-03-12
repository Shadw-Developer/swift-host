import { EventEmitter } from 'events';
import { HealthStatus } from '../types';
export declare class HealthMonitor extends EventEmitter {
    private targetUrl;
    private interval;
    private timer?;
    private lastStatus?;
    constructor(targetUrl: string, intervalMs?: number);
    start(): void;
    stop(): void;
    private check;
    getStatus(): HealthStatus | undefined;
}
//# sourceMappingURL=monitor.d.ts.map