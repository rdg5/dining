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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const configurationProvider = __importStar(require("@practica/configuration-provider"));
const logger_1 = require("@practica/logger");
// import { establishAssociations } from './associations';
const user_model_1 = require("./user-model");
const team_model_1 = require("./team-model");
const role_model_1 = require("./role-model");
const permission_model_1 = require("./permission-model");
const associations_1 = require("./associations");
let dbConnection;
function getDbConnection() {
    if (!dbConnection) {
        dbConnection = new sequelize_1.Sequelize(configurationProvider.getValue('DB.dbName'), configurationProvider.getValue('DB.userName'), configurationProvider.getValue('DB.password'), {
            port: 54320,
            dialect: 'postgres',
            benchmark: true,
            logging: (sql, duration) => {
                logger_1.logger.info(`Sequelize operation was just executed in ${duration} ms with sql: ${sql}`);
            },
            logQueryParameters: true,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
        (0, user_model_1.getUserModel)();
        (0, team_model_1.getTeamModel)();
        (0, role_model_1.getRoleModel)();
        (0, permission_model_1.getPermissionModel)();
        (0, associations_1.establishAssociations)();
        // dbConnection.sync({ alter: true });
        // eslint-disable-next-line no-console
        console.log('DB & TABLES CREATED');
    }
    return dbConnection;
}
exports.default = getDbConnection;
