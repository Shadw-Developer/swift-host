"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
function setupRoutes(app, logger, manager) {
    app.get('/', async (req, res) => {
        const stats = logger.getStats();
        const recentLogs = await logger.query({ limit: 50 });
        const tunnels = manager.getAll();
        res.render('dashboard', {
            title: 'SwiftHost Dashboard',
            stats,
            recentLogs,
            tunnels,
            formatBytes: (bytes) => {
                if (bytes === 0)
                    return '0 B';
                const k = 1024;
                const sizes = ['B', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
        });
    });
    app.get('/api/tunnels', (req, res) => {
        res.json(manager.getAllStats());
    });
    app.post('/api/tunnels', async (req, res) => {
        const { targetUrl, port } = req.body;
        try {
            const session = await manager.create(targetUrl, { proxyPort: port });
            res.json(session);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    app.delete('/api/tunnels/:id', (req, res) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        manager.stop(id);
        res.json({ success: true });
    });
    app.get('/api/logs', async (req, res) => {
        const { limit, ip, path, host } = req.query;
        const logs = await logger.query({
            limit: limit ? parseInt(limit) : 100,
            ip: ip,
            path: path,
            host: host
        });
        res.json(logs);
    });
    app.get('/api/stats', async (req, res) => {
        const files = logger.getStats();
        const tunnels = manager.getAll();
        const totalRequests = tunnels.reduce((acc, t) => acc + (t.metrics?.totalRequests || 0), 0);
        res.json({
            files,
            tunnels: tunnels.length,
            totalRequests,
            activeTunnels: tunnels.filter(t => t.status === 'active').length
        });
    });
    app.get('/tunnel/:id', (req, res) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const tunnel = manager.getAll().find(t => t.id === id);
        if (!tunnel)
            return res.status(404).render('error', { message: 'Tunnel não encontrado' });
        res.render('tunnel-detail', { tunnel, title: `Tunnel ${tunnel.id}` });
    });
    app.get('/analytics', async (req, res) => {
        const logs = await logger.query({ limit: 1000 });
        const pathCounts = {};
        const ipCounts = {};
        const hourlyCounts = {};
        logs.forEach(log => {
            pathCounts[log.path] = (pathCounts[log.path] || 0) + 1;
            ipCounts[log.ip] = (ipCounts[log.ip] || 0) + 1;
            const hour = log.timestamp.substring(0, 13);
            hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
        });
        res.render('analytics', {
            title: 'Analytics',
            topPaths: Object.entries(pathCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10),
            uniqueIps: Object.keys(ipCounts).length,
            hourlyData: Object.entries(hourlyCounts).sort()
        });
    });
}
//# sourceMappingURL=routes.js.map