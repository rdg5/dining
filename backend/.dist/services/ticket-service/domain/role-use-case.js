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
exports.deleteRoleById = exports.editExistingRole = exports.createNewRole = exports.getRoleById = exports.getRoles = void 0;
/* eslint-disable no-console */
const ajv_cache_1 = __importDefault(require("@practica/validation/ajv-cache"));
const uuid_1 = require("uuid");
const error_handling_1 = require("@practica/error-handling");
const roleRepository = __importStar(require("../data-access/role-repository"));
const role_schema_1 = require("./Schemas/role-schema");
async function getRoles() {
    return await roleRepository.getAllRoles();
}
exports.getRoles = getRoles;
async function getRoleById(roleId) {
    return await roleRepository.getRoleByRoleId(roleId);
}
exports.getRoleById = getRoleById;
async function createNewRole(requestBody) {
    assertRoleIsValid(requestBody);
    await assertRoleToBeCreatedorEditedIsUnique(requestBody);
    return await roleRepository.saveNewRole(requestBody);
}
exports.createNewRole = createNewRole;
async function editExistingRole(roleId, requestBody) {
    assertEditingRoleIsValid(requestBody);
    await assertRoleToBeCreatedorEditedIsUnique(requestBody, roleId);
    return await roleRepository.updateExistingRoleById(roleId, requestBody);
}
exports.editExistingRole = editExistingRole;
async function deleteRoleById(roleId) {
    const roleExistsforDeletion = await roleRepository.getRoleByRoleId(roleId);
    if (roleExistsforDeletion) {
        roleExistsforDeletion.role += `-${(0, uuid_1.v4)()}`;
        await roleRepository.updateExistingRoleByRoleName(roleExistsforDeletion);
    }
    await roleRepository.deleteExistingRole(roleId);
    return roleExistsforDeletion;
}
exports.deleteRoleById = deleteRoleById;
async function assertRoleToBeCreatedorEditedIsUnique(requestBody, roleId) {
    const { role } = requestBody;
    const alreadyExistingRole = await roleRepository.getRoleByRoleName(role);
    if (alreadyExistingRole !== null) {
        throw new error_handling_1.AppError('validation-failed', `Role already exists`, 409, true);
    }
}
function assertRoleIsValid(roleToBeCreated) {
    const isValid = ajv_cache_1.default.validate(role_schema_1.roleSchema, roleToBeCreated);
    if (isValid === false) {
        throw new error_handling_1.AppError('invalid-role-creation', `Validation failed`, 400, true);
    }
}
function assertEditingRoleIsValid(roleToBeEdited) {
    const isValid = ajv_cache_1.default.validate(role_schema_1.editRoleSchema, roleToBeEdited);
    if (isValid === false) {
        throw new error_handling_1.AppError('invalid-role-editing', `Validation failed`, 400, true);
    }
}
