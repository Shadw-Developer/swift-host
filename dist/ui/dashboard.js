"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const chalk_1 = __importDefault(require("chalk"));
const boxen_1 = __importDefault(require("boxen"));
const ora_1 = __importDefault(require("ora"));
const events_1 = require("events");
class Dashboard extends events_1.EventEmitter {
    constructor(quiet = false, debug = false) {
        super();
        this.quiet = quiet;
        this.debug = debug;
    }
    startLoading(text) {
        if (this.quiet)
            return;
        this.spinner = (0, ora_1.default)({ text, color: 'cyan' }).start();
    }
    succeed(text) {
        if (this.quiet)
            return;
        this.spinner?.succeed(text);
    }
    fail(text) {
        if (this.quiet)
            return;
        this.spinner?.fail(text);
    }
    infoLog(text) {
        if (this.quiet || !this.debug)
            return;
        console.log(chalk_1.default.gray(`[swf] ${text}`));
    }
    showBanner(info) {
        if (this.quiet)
            return;
        this.info = info;
        const content = [
            `${chalk_1.default.bold('🚀 SwiftHost Tunnel Ativo')}`,
            ``,
            `${chalk_1.default.bold('Público:')}  ${chalk_1.default.green.underline(info.publicUrl)}`,
            `${chalk_1.default.bold('Local:')}    ${chalk_1.default.blue(info.localUrl)}`,
            `${chalk_1.default.bold('Proxy:')}    Porta ${chalk_1.default.yellow(info.proxyPort)}`,
            ``,
            `${chalk_1.default.dim('Pressione Ctrl+C para encerrar')}`
        ].join('\n');
        console.log((0, boxen_1.default)(content, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan',
            backgroundColor: '#000000'
        }));
    }
    showStats() {
        if (this.quiet || !this.info)
            return;
        const stats = this.info.metrics;
        const uptime = Math.floor((Date.now() - stats.startTime.getTime()) / 1000);
        console.log(chalk_1.default.dim(`\n📊 ${stats.requests} reqs | ${this.formatBytes(stats.bytesTransferred)} | ${this.formatTime(uptime)} uptime`));
    }
    showError(error) {
        if (this.quiet)
            return;
        console.error(chalk_1.default.red(`\n❌ Erro: ${error}`));
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m${secs}s` : `${secs}s`;
    }
}
exports.Dashboard = Dashboard;
//# sourceMappingURL=dashboard.js.map