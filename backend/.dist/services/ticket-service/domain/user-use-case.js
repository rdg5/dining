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
exports.deleteUserById = exports.editExistingUser = exports.createNewUser = exports.getUsersWithTeams = exports.getUserById = exports.getUsers = void 0;
/* eslint-disable no-console */
const ajv_cache_1 = __importDefault(require("@practica/validation/ajv-cache"));
const uuid_1 = require("uuid");
const error_handling_1 = require("@practica/error-handling");
const userRepository = __importStar(require("../data-access/user-repository"));
const user_schema_1 = require("./Schemas/user-schema");
async function getUsers() {
    return await userRepository.getAllUsers();
}
exports.getUsers = getUsers;
async function getUserById(userId) {
    return await userRepository.getUserByUserId(userId);
}
exports.getUserById = getUserById;
async function getUsersWithTeams() {
    return await userRepository.getAllUsersWithTeams();
}
exports.getUsersWithTeams = getUsersWithTeams;
async function createNewUser(requestBody) {
    assertUserIsValid(requestBody);
    await assertEmailAndUsernameAreUnique(requestBody);
    return await userRepository.saveNewUser(requestBody);
}
exports.createNewUser = createNewUser;
async function editExistingUser(userId, requestBody) {
    assertEditingUserIsValid(requestBody);
    await assertEmailAndUsernameAreUnique(requestBody, userId);
    return await userRepository.updateExistingUserById(userId, requestBody);
}
exports.editExistingUser = editExistingUser;
async function deleteUserById(userId) {
    const userExistsforDeletion = await userRepository.getUserByUserId(userId);
    if (userExistsforDeletion) {
        userExistsforDeletion.username += `-${(0, uuid_1.v4)()}`;
        userExistsforDeletion.email += `-${(0, uuid_1.v4)()}`;
        await userRepository.updateExistingUserByUser(userExistsforDeletion);
    }
    await userRepository.deleteExistingUser(userId);
    return userExistsforDeletion;
}
exports.deleteUserById = deleteUserById;
async function assertEmailAndUsernameAreUnique(requestBody, userId) {
    const { username, email } = requestBody;
    const alreadyExistingUser = await userRepository.getUserByUsernameOrEmailExceptCurrent(username, email, userId);
    if (alreadyExistingUser !== null) {
        const { username: existingUsername, email: existingEmail } = alreadyExistingUser;
        if (existingUsername === username) {
            throw new error_handling_1.AppError('validation-failed', `Username already in use`, 409, true);
        }
        if (existingEmail === email) {
            throw new error_handling_1.AppError('validation-failed', `Email already in use`, 409, true);
        }
    }
}
function assertUserIsValid(userToBeCreated) {
    const isValid = ajv_cache_1.default.validate(user_schema_1.userSchema, userToBeCreated);
    if (isValid === false) {
        throw new error_handling_1.AppError('invalid-user-creation', `Validation failed`, 400, true);
    }
}
function assertEditingUserIsValid(userToBeEdited) {
    const isValid = ajv_cache_1.default.validate(user_schema_1.editUserSchema, userToBeEdited);
    if (isValid === false) {
        throw new error_handling_1.AppError('invalid-user-editing', `Validation failed`, 400, true);
    }
}
