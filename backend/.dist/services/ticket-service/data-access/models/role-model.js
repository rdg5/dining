"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleModel = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("./db-connection"));
let roleModel;
function getRoleModel() {
    if (!roleModel) {
        roleModel = (0, db_connection_1.default)().define('Role', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            role: {
                type: sequelize_1.DataTypes.STRING,
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
        }, { freezeTableName: true, paranoid: true });
        // eslint-disable-next-line no-console
        console.log('Role model defined!');
    }
    return roleModel;
}
exports.getRoleModel = getRoleModel;
