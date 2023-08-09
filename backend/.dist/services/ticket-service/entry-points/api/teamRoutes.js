"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("@practica/logger");
function defineTeamRoutes(expressApp) {
    const router = express_1.default.Router();
    router.get('/haho', async (req, res, next) => {
        try {
            logger_1.logger.info(`Hello API was called`);
            res.json('hello');
        }
        catch (error) {
            next(error);
        }
    });
    expressApp.use('/haho', router);
}
exports.default = defineTeamRoutes;
