import { EventEmitter } from 'events';
import { TunnelSession } from '../../types';
export declare class TunnelManager extends EventEmitter {
    private tunnels;
    create(targetUrl: string, options?: any): Promise<TunnelSession>;
    stop(id: string): void;
    getAll(): TunnelSession[];
    getAllStats(): {
        tunnels: TunnelSession[];
        count: number;
    };
}
//# sourceMappingURL=tunnel-manager.d.ts.map