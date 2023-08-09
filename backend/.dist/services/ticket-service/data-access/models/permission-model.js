"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionModel = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("./db-connection"));
let permissionModel;
function getPermissionModel() {
    if (!permissionModel) {
        permissionModel = (0, db_connection_1.default)().define('Permission', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            ability: {
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
    }
    // eslint-disable-next-line no-console
    console.log('Permission model defined!');
    return permissionModel;
}
exports.getPermissionModel = getPermissionModel;
