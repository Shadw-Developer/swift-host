export interface TunnelConfig {
    targetUrl: string;
    proxyPort?: number;
    quiet?: boolean;
    debug?: boolean;
    subdomain?: string;
    retries?: number;
    enableLogs?: boolean;
    guiPort?: number;
}
export interface TunnelInfo {
    publicUrl: string;
    localUrl: string;
    proxyPort: number;
    metrics: {
        requests: number;
        startTime: Date;
        bytesTransferred: number;
    };
}
export interface HealthStatus {
    isHealthy: boolean;
    latency: number;
    lastChecked: Date;
    error?: string;
}
export interface RequestLog {
    id: string;
    timestamp: string;
    ip: string;
    host: string;
    method: string;
    path: string;
    headers: Record<string, string>;
    userAgent?: string;
    referer?: string;
    responseStatus?: number;
    responseTime?: number;
    bytesIn?: number;
    bytesOut?: number;
    country?: string;
    city?: string;
}
export interface TunnelSession {
    id: string;
    publicUrl: string;
    localUrl: string;
    proxyPort: number;
    startTime: Date;
    status: 'active' | 'error' | 'closed';
    metrics: {
        totalRequests: number;
        totalBytesIn: number;
        totalBytesOut: number;
        uniqueIps: Set<string>;
    };
    logs: RequestLog[];
}
export interface DashboardStats {
    activeTunnels: number;
    totalRequests: number;
    bandwidthUsed: number;
    topPaths: Array<{
        path: string;
        count: number;
    }>;
    recentLogs: RequestLog[];
}
export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';
//# sourceMappingURL=index.d.ts.map