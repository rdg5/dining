"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExistingPermission = exports.updateExistingPermissionByPermissionName = exports.updateExistingPermissionById = exports.saveNewPermission = exports.getpermissionByPermissionName = exports.getPermissionByPermissionId = exports.getAllPermissions = void 0;
/* eslint-disable no-console */
const permission_model_1 = require("./models/permission-model");
async function getAllPermissions() {
    try {
        const allPermissions = await (0, permission_model_1.getPermissionModel)().findAll({
            attributes: ['id', 'ability'],
            raw: true,
        });
        return allPermissions;
    }
    catch (error) {
        console.error('Error in getAllpermissions:', error);
        throw error;
    }
}
exports.getAllPermissions = getAllPermissions;
async function getPermissionByPermissionId(permissionId) {
    try {
        const existingPermissionById = await (0, permission_model_1.getPermissionModel)().findByPk(permissionId, {
            attributes: ['id', 'ability'],
        });
        return existingPermissionById;
    }
    catch (error) {
        console.error('Error in getPermissionByRoleId:', error);
        throw error;
    }
}
exports.getPermissionByPermissionId = getPermissionByPermissionId;
async function getpermissionByPermissionName(ability) {
    try {
        const existingPermission = await (0, permission_model_1.getPermissionModel)().findOne({
            where: { ability },
        });
        return existingPermission;
    }
    catch (error) {
        console.error('Error in getPermissionByPermissionName:', error);
        throw error;
    }
}
exports.getpermissionByPermissionName = getpermissionByPermissionName;
async function saveNewPermission(newPermissionData) {
    try {
        const addedPermission = await (0, permission_model_1.getPermissionModel)().create(newPermissionData, {
            attributes: ['id', 'ability'],
            raw: true,
        });
        return addedPermission;
    }
    catch (error) {
        console.error('Error in saveNewPermission:', error);
        throw error;
    }
}
exports.saveNewPermission = saveNewPermission;
async function updateExistingPermissionById(permissionId, permissionDetails) {
    try {
        await (0, permission_model_1.getPermissionModel)().update(permissionDetails, {
            where: { id: permissionId },
        });
        const updatedPermission = await (0, permission_model_1.getPermissionModel)().findByPk(permissionId, {
            attributes: ['id', 'ability'],
            raw: true,
        });
        return updatedPermission;
    }
    catch (error) {
        console.error('Error in updateExistingPermissionById', error);
        throw error;
    }
}
exports.updateExistingPermissionById = updateExistingPermissionById;
async function updateExistingPermissionByPermissionName(permission) {
    try {
        await (0, permission_model_1.getPermissionModel)().update({ ability: permission.ability }, { where: { id: permission.id } });
        return permission;
    }
    catch (error) {
        console.error('Error in updateExistingPermissionByRoleName:', error);
        throw error;
    }
}
exports.updateExistingPermissionByPermissionName = updateExistingPermissionByPermissionName;
async function deleteExistingPermission(permissionId) {
    try {
        const permissionToBeDeleted = await (0, permission_model_1.getPermissionModel)().findByPk(permissionId, {
            attributes: ['id', 'ability'],
            raw: true,
        });
        await (0, permission_model_1.getPermissionModel)().destroy({
            where: {
                id: permissionId,
            },
        });
        return permissionToBeDeleted;
    }
    catch (error) {
        console.error('Error in deleteExistingPermission', error);
        throw error;
    }
}
exports.deleteExistingPermission = deleteExistingPermission;
