"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.establishAssociations = void 0;
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("./db-connection"));
const user_model_1 = require("./user-model");
const team_model_1 = require("./team-model");
const role_model_1 = require("./role-model");
const permission_model_1 = require("./permission-model");
function establishAssociations() {
    const User = (0, user_model_1.getUserModel)();
    const Team = (0, team_model_1.getTeamModel)();
    const Role = (0, role_model_1.getRoleModel)();
    const Permission = (0, permission_model_1.getPermissionModel)();
    // Intermediary models for many-to-many relationships
    const UserTeam = (0, db_connection_1.default)().define('UserTeam', {
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
        teamId: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
    }, {
        freezeTableName: true,
    });
    const UserRole = (0, db_connection_1.default)().define('UserRole', {
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
        roleId: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
    }, {
        freezeTableName: true,
    });
    const UserPermission = (0, db_connection_1.default)().define('UserPermission', {
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
        permissionId: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
        },
    }, {
        freezeTableName: true,
    });
    // Define the many-to-many relationships
    User.belongsToMany(Team, {
        through: UserTeam,
        foreignKey: 'userId',
        otherKey: 'teamId',
    });
    Team.belongsToMany(User, {
        through: UserTeam,
        foreignKey: 'teamId',
        otherKey: 'userId',
    });
    User.belongsToMany(Role, {
        through: UserRole,
        foreignKey: 'userId',
        otherKey: 'roleId',
    });
    Role.belongsToMany(User, {
        through: UserRole,
        foreignKey: 'roleId',
        otherKey: 'userId',
    });
    User.belongsToMany(Permission, {
        through: UserPermission,
        foreignKey: 'userId',
        otherKey: 'permissionId',
    });
    Permission.belongsToMany(User, {
        through: UserPermission,
        foreignKey: 'permissionId',
        otherKey: 'userId',
    });
    // eslint-disable-next-line no-console
    console.log('ASSOCIATIONS ESTABLISHED');
}
exports.establishAssociations = establishAssociations;
