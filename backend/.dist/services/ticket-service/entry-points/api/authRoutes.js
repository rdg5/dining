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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("@practica/logger");
const error_handling_1 = require("@practica/error-handling");
const authUseCase = __importStar(require("../../domain/auth-use-case"));
function defineUserRoutes(expressApp) {
    const router = express_1.default.Router();
    router.post('/register', async (req, res, next) => {
        try {
            logger_1.logger.info(`Auth API was called to register a new user`);
            const response = await authUseCase.register(req.body);
            if (!response) {
                res.status(404).end();
                return;
            }
            res.status(201).json({ status: 'ok' });
        }
        catch (error) {
            if (error instanceof error_handling_1.AppError) {
                res.status(error.HTTPStatus).json({ error: error.message });
                next(error);
            }
        }
    });
    router.post('/login', async (req, res, next) => {
        try {
            logger_1.logger.info(`Auth API was called to login a user`);
            const response = await authUseCase.login(req.body);
            if (!response) {
                res.status(404).end();
                return;
            }
            res.status(201).json({ status: 'ok', token: response });
        }
        catch (error) {
            if (error instanceof error_handling_1.AppError) {
                res.status(error.HTTPStatus).json({ error: error.message });
                next(error);
            }
        }
    });
    router.post('/refresh', async (req, res, next) => {
        try {
            logger_1.logger.info(`Auth API was called to refresh an expired token`);
            const response = authUseCase.refreshTokenGenerator(req.body, req.headers.authorization);
            if (!response) {
                res.status(404).end();
                return;
            }
            res.status(201).json({ status: 'ok', token: response });
        }
        catch (error) {
            if (error instanceof error_handling_1.AppError) {
                res.status(error.HTTPStatus).json({ error: error.message });
                next(error);
            }
        }
    });
    expressApp.use('/auth', router);
}
exports.default = defineUserRoutes;
