"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamModel = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("./db-connection"));
let teamModel;
function getTeamModel() {
    if (!teamModel) {
        teamModel = (0, db_connection_1.default)().define('Team', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
            },
            deletedAt: {
                type: sequelize_1.DataTypes.DATE,
            },
        }, { freezeTableName: true });
        // eslint-disable-next-line no-console
        console.log('TEAM model defined!');
    }
    return teamModel;
}
exports.getTeamModel = getTeamModel;
