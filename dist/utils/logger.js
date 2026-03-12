"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.banner = exports.RequestLogger = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
class RequestLogger {
    constructor() {
        this.buffer = [];
        this.basePath = path.join(process.cwd(), 'database');
        this.ensureDirectory();
        this.currentFile = this.generateFileName();
        this.openStream();
        this.flushInterval = setInterval(() => this.flush(), 5000);
    }
    ensureDirectory() {
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }
    generateFileName() {
        const now = new Date();
        return path.join(this.basePath, `${(0, date_fns_1.format)(now, 'yyyy-MM-dd-HH')}.log.json`);
    }
    openStream() {
        this.writeStream = fs.createWriteStream(this.currentFile, { flags: 'a' });
    }
    rotateIfNeeded() {
        const newFile = this.generateFileName();
        if (newFile !== this.currentFile) {
            this.flush();
            this.writeStream?.end();
            this.currentFile = newFile;
            this.openStream();
        }
    }
    log(data) {
        this.rotateIfNeeded();
        const entry = {
            id: (0, uuid_1.v4)(),
            timestamp: new Date().toISOString(),
            ...data
        };
        this.buffer.push(entry);
        if (this.buffer.length > 100) {
            this.flush();
        }
    }
    flush() {
        if (this.buffer.length === 0 || !this.writeStream)
            return;
        const lines = this.buffer.map(entry => JSON.stringify(entry)).join('\n') + '\n';
        this.writeStream.write(lines);
        this.buffer = [];
    }
    async query(filters = {}) {
        const files = fs.readdirSync(this.basePath)
            .filter(f => f.endsWith('.log.json'))
            .sort()
            .reverse();
        const results = [];
        const limit = filters.limit || 1000;
        for (const file of files) {
            if (results.length >= limit)
                break;
            const content = await fs.promises.readFile(path.join(this.basePath, file), 'utf-8');
            const lines = content.trim().split('\n').filter(Boolean);
            for (const line of lines.reverse()) {
                try {
                    const entry = JSON.parse(line);
                    if (filters.startTime && new Date(entry.timestamp) < filters.startTime)
                        continue;
                    if (filters.endTime && new Date(entry.timestamp) > filters.endTime)
                        continue;
                    if (filters.ip && entry.ip !== filters.ip)
                        continue;
                    if (filters.path && !entry.path.includes(filters.path))
                        continue;
                    if (filters.host && entry.host !== filters.host)
                        continue;
                    results.push(entry);
                    if (results.length >= limit)
                        break;
                }
                catch {
                    continue;
                }
            }
        }
        return results;
    }
    getStats() {
        const files = fs.readdirSync(this.basePath).filter(f => f.endsWith('.log.json'));
        let totalSize = 0;
        for (const file of files) {
            const stats = fs.statSync(path.join(this.basePath, file));
            totalSize += stats.size;
        }
        return { totalFiles: files.length, totalSize };
    }
    destroy() {
        clearInterval(this.flushInterval);
        this.flush();
        this.writeStream?.end();
    }
}
exports.RequestLogger = RequestLogger;
exports.banner = `
   ███████╗██╗    ██╗██╗███████╗████████╗██╗  ██╗ ██████╗ ███████╗████████╗
   ██╔════╝██║    ██║██║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔════╝╚══██╔══╝
   ███████╗██║ █╗ ██║██║█████╗     ██║   ███████║██║   ██║███████╗   ██║
   ╚════██║██║███╗██║██║██╔══╝     ██║   ██╔══██║██║   ██║╚════██║   ██║
   ███████║╚███╔███╔╝██║██║        ██║   ██║  ██║╚██████╔╝███████║   ██║
   ╚══════╝ ╚══╝╚══╝ ╚═╝╚═╝        ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝
`;
//# sourceMappingURL=logger.js.map