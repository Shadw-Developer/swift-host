import { EventEmitter } from 'events';
import { TunnelInfo } from '../types';
export declare class Dashboard extends EventEmitter {
    private spinner?;
    private quiet;
    private debug;
    private info?;
    constructor(quiet?: boolean, debug?: boolean);
    startLoading(text: string): void;
    succeed(text: string): void;
    fail(text: string): void;
    infoLog(text: string): void;
    showBanner(info: TunnelInfo): void;
    showStats(): void;
    showError(error: string): void;
    private formatBytes;
    private formatTime;
}
//# sourceMappingURL=dashboard.d.ts.map