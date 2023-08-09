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
exports.deletePermissionById = exports.editExistingPermission = exports.createNewPermission = exports.getPermissionById = exports.getAllpermissions = void 0;
/* eslint-disable no-console */
const ajv_cache_1 = __importDefault(require("@practica/validation/ajv-cache"));
const uuid_1 = require("uuid");
const error_handling_1 = require("@practica/error-handling");
const permissionRepository = __importStar(require("../data-access/permission-repository"));
const permission_schema_1 = require("./Schemas/permission-schema");
async function getAllpermissions() {
    return await permissionRepository.getAllPermissions();
}
exports.getAllpermissions = getAllpermissions;
async function getPermissionById(permissionId) {
    return await permissionRepository.getPermissionByPermissionId(permissionId);
}
exports.getPermissionById = getPermissionById;
async function createNewPermission(requestBody) {
    assertPermissionIsValid(requestBody);
    await asserPermissionToBeCreatedOrEditedIsUnique(requestBody);
    return await permissionRepository.saveNewPermission(requestBody);
}
exports.createNewPermission = createNewPermission;
async function editExistingPermission(permissionId, requestBody) {
    assertEditingPermissionIsValid(requestBody);
    await asserPermissionToBeCreatedOrEditedIsUnique(requestBody, permissionId);
    return await permissionRepository.updateExistingPermissionById(permissionId, requestBody);
}
exports.editExistingPermission = editExistingPermission;
async function deletePermissionById(permissionId) {
    const permissionExistsforDeletion = await permissionRepository.getPermissionByPermissionId(permissionId);
    if (permissionExistsforDeletion) {
        permissionExistsforDeletion.ability += `-${(0, uuid_1.v4)()}`;
        await permissionRepository.updateExistingPermissionByPermissionName(permissionExistsforDeletion);
    }
    await permissionRepository.deleteExistingPermission(permissionId);
    return permissionExistsforDeletion;
}
exports.deletePermissionById = deletePermissionById;
async function asserPermissionToBeCreatedOrEditedIsUnique(requestBody, permissionId) {
    const { ability } = requestBody;
    const alreadyExistingpermission = await permissionRepository.getpermissionByPermissionName(ability);
    if (alreadyExistingpermission !== null) {
        throw new error_handling_1.AppError('validation-failed', `permission already exists`, 409, true);
    }
}
function assertPermissionIsValid(permissionToBeCreated) {
    const isValid = ajv_cache_1.default.validate(permission_schema_1.permissionSchema, permissionToBeCreated);
    if (isValid === false) {
        throw new error_handling_1.AppError('invalid-permission-creation', `Validation failed`, 400, true);
    }
}
function assertEditingPermissionIsValid(permissionToBeEdited) {
    const isValid = ajv_cache_1.default.validate(permission_schema_1.editPermissionSchema, permissionToBeEdited);
    if (isValid === false) {
        throw new error_handling_1.AppError('invalid-permission-editing', `Validation failed`, 400, true);
    }
}
