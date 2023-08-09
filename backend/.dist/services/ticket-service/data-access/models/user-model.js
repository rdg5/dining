"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserModel = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("./db-connection"));
let userModel;
function getUserModel() {
    if (!userModel) {
        userModel = (0, db_connection_1.default)().define('User', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: sequelize_1.DataTypes.STRING,
                unique: true,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                unique: true,
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
            },
            verifiedAt: {
                type: sequelize_1.DataTypes.DATE,
            },
            verificationToken: {
                type: sequelize_1.DataTypes.STRING,
            },
            verificationTokenExpiresAt: {
                type: sequelize_1.DataTypes.DATE,
            },
            forgottenPasswordToken: {
                type: sequelize_1.DataTypes.STRING,
            },
            forgottenPasswordTokenExpiresAt: {
                type: sequelize_1.DataTypes.DATE,
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
        console.log('User model defined!');
    }
    return userModel;
}
exports.getUserModel = getUserModel;
