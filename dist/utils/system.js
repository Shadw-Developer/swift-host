"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.which = which;
exports.checkPort = checkPort;
const child_process_1 = require("child_process");
const os_1 = require("os");
async function which(command) {
    try {
        const cmd = (0, os_1.platform)() === 'win32' ? 'where' : 'which';
        const result = (0, child_process_1.execSync)(`${cmd} ${command}`, { encoding: 'utf8' });
        return result.trim().split('\n')[0];
    }
    catch {
        return null;
    }
}
function checkPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const tester = net.createServer()
            .once('error', () => resolve(false))
            .once('listening', () => {
            tester.once('close', () => resolve(true)).close();
        })
            .listen(port);
    });
}
//# sourceMappingURL=system.js.map