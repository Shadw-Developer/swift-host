import { TunnelConfig } from '../types';
export interface DeployResult {
    url: string;
    stop: () => Promise<void>;
    getStats: () => any;
}
export declare function deploy(targetUrl: string, options?: Partial<TunnelConfig>): Promise<DeployResult>;
export { EnhancedProxyServer } from '../core/enhanced-proxy';
export { CloudflareTunnel } from '../core/tunnel';
export { HealthMonitor } from '../core/monitor';
export { Dashboard } from '../ui/dashboard';
export { RequestLogger } from '../utils/logger';
export { DashboardServer } from '../server';
export * from '../types';
//# sourceMappingURL=deploy.d.ts.map