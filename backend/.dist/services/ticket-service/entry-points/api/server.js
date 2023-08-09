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
exports.stopWebServer = exports.startWebServer = void 0;
const logger_1 = require("@practica/logger");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const error_handling_1 = require("@practica/error-handling");
const configurationProvider = __importStar(require("@practica/configuration-provider"));
const jwt_token_verifier_1 = require("@practica/jwt-token-verifier");
const request_context_1 = require("@practica/request-context");
const config_1 = __importDefault(require("../../config"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const db_connection_1 = __importDefault(require("../../data-access/models/db-connection"));
const roleRoutes_1 = __importDefault(require("./roleRoutes"));
const teamRoutes_1 = __importDefault(require("./teamRoutes"));
const permissionRoutes_1 = __importDefault(require("./permissionRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
let connection;
async function startWebServer() {
    configurationProvider.initializeAndValidate(config_1.default);
    logger_1.logger.configureLogger({
        prettyPrint: Boolean(configurationProvider.getValue('logger.prettyPrint')),
    }, true);
    await (0, db_connection_1.default)();
    const expressApp = (0, express_1.default)();
    expressApp.use(request_context_1.addRequestIdExpressMiddleware);
    expressApp.use((0, helmet_1.default)());
    expressApp.use(express_1.default.urlencoded({ extended: true }));
    expressApp.use(express_1.default.json());
    expressApp.use((0, jwt_token_verifier_1.jwtVerifierMiddleware)({
        secret: configurationProvider.getValue('jwtTokenSecret'),
    }));
    (0, userRoutes_1.default)(expressApp);
    (0, authRoutes_1.default)(expressApp);
    (0, roleRoutes_1.default)(expressApp);
    (0, teamRoutes_1.default)(expressApp);
    (0, permissionRoutes_1.default)(expressApp);
    defineErrorHandlingMiddleware(expressApp);
    const APIAddress = await openConnection(expressApp);
    return APIAddress;
}
exports.startWebServer = startWebServer;
async function stopWebServer() {
    return new Promise((resolve) => {
        if (connection !== undefined) {
            connection.close(() => {
                resolve();
            });
        }
    });
}
exports.stopWebServer = stopWebServer;
async function openConnection(expressApp) {
    return new Promise((resolve) => {
        const portToListenTo = configurationProvider.getValue('port');
        const webServerPort = portToListenTo || 0;
        logger_1.logger.info(`Server is about to listen to port ${webServerPort}`);
        connection = expressApp.listen(webServerPort, () => {
            error_handling_1.errorHandler.listenToErrorEvents(connection);
            resolve(connection.address());
        });
    });
}
function defineErrorHandlingMiddleware(expressApp) {
    expressApp.use(async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error, req, res, 
    // Express requires next function in default error handlers
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next) => {
        if (error && typeof error === 'object') {
            if (error.isTrusted === undefined || error.isTrusted === null) {
                error.isTrusted = true; // Error during a specific request is usually not fatal and should not lead to process exit
            }
        }
        error_handling_1.errorHandler.handleError(error);
        res.status(error?.HTTPStatus || 500).end();
    });
}
