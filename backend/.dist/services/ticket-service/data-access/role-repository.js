"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExistingRole = exports.updateExistingRoleByRoleName = exports.updateExistingRoleById = exports.saveNewRole = exports.getRoleByRoleName = exports.getRoleByRoleId = exports.getAllRoles = void 0;
const role_model_1 = require("./models/role-model");
async function getAllRoles() {
    try {
        const allRoles = await (0, role_model_1.getRoleModel)().findAll({
            attributes: ['id', 'role'],
            raw: true,
        });
        return allRoles;
    }
    catch (error) {
        console.error('Error in getAllRoles:', error);
        throw error;
    }
}
exports.getAllRoles = getAllRoles;
async function getRoleByRoleId(roleId) {
    try {
        const existingRoleById = await (0, role_model_1.getRoleModel)().findByPk(roleId, {
            attributes: ['id', 'role'],
        });
        return existingRoleById;
    }
    catch (error) {
        console.error('Error in getRoleByRoleId:', error);
        throw error;
    }
}
exports.getRoleByRoleId = getRoleByRoleId;
async function getRoleByRoleName(role) {
    try {
        const existingRole = await (0, role_model_1.getRoleModel)().findOne({
            where: { role },
        });
        console.log(existingRole);
        return existingRole;
    }
    catch (error) {
        console.error('Error in getRoleByRoleName:', error);
        throw error;
    }
}
exports.getRoleByRoleName = getRoleByRoleName;
async function saveNewRole(newRoleData) {
    try {
        const addedRole = await (0, role_model_1.getRoleModel)().create(newRoleData, {
            attributes: ['id', 'role'],
            raw: true,
        });
        return addedRole;
    }
    catch (error) {
        console.error('Error in saveNewRole:', error);
        throw error;
    }
}
exports.saveNewRole = saveNewRole;
async function updateExistingRoleById(roleId, roleDetails) {
    try {
        await (0, role_model_1.getRoleModel)().update(roleDetails, {
            where: { id: roleId },
        });
        const updatedRole = await (0, role_model_1.getRoleModel)().findByPk(roleId, {
            attributes: ['id', 'role'],
            raw: true,
        });
        return updatedRole;
    }
    catch (error) {
        console.error('Error in updateExistingRoleById', error);
        throw error;
    }
}
exports.updateExistingRoleById = updateExistingRoleById;
async function updateExistingRoleByRoleName(role) {
    try {
        await (0, role_model_1.getRoleModel)().update({ role: role.role }, { where: { id: role.id } });
        return role;
    }
    catch (error) {
        console.error('Error in updateExistingRoleByRoleName:', error);
        throw error;
    }
}
exports.updateExistingRoleByRoleName = updateExistingRoleByRoleName;
async function deleteExistingRole(roleId) {
    try {
        const roleToBeDeleted = await (0, role_model_1.getRoleModel)().findByPk(roleId, {
            attributes: ['id', 'role'],
            raw: true,
        });
        await (0, role_model_1.getRoleModel)().destroy({
            where: {
                id: roleId,
            },
        });
        return roleToBeDeleted;
    }
    catch (error) {
        console.error('Error in deleteExistingRole', error);
        throw error;
    }
}
exports.deleteExistingRole = deleteExistingRole;
