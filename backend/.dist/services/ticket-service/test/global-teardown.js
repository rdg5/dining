"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const docker_compose_1 = __importDefault(require("docker-compose"));
const path_1 = __importDefault(require("path"));
exports.default = async () => {
    await docker_compose_1.default.down({ cwd: path_1.default.join(__dirname), log: true });
    // eslint-disable-next-line no-console
    console.log('TEARDOWNdsadsadasdsadas');
};
