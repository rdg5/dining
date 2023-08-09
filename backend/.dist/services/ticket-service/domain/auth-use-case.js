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
exports.register = void 0;
/* eslint-disable no-console */
const ajv_cache_1 = __importDefault(require("@practica/validation/ajv-cache"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_handling_1 = require("@practica/error-handling");
const user_schema_1 = require("./Schemas/user-schema");
const userRepository = __importStar(require("../data-access/user-repository"));
const authRepository = __importStar(require("../data-access/auth-repository"));
async function register(requestBody) {
    assertUserIsValid(requestBody);
    await assertEmailAndUsernameAreUnique(requestBody);
    requestBody.password = await bcrypt_1.default.hash(requestBody.password, 12);
    return await authRepository.saveNewUser(requestBody);
}
exports.register = register;
function assertUserIsValid(userToBeCreated) {
    const isValid = ajv_cache_1.default.validate(user_schema_1.userSchema, userToBeCreated);
    if (isValid === false && ajv_cache_1.default.errors) {
        const errorMessage = getCustomErrorMessage(ajv_cache_1.default.errors);
        throw new error_handling_1.AppError('invalid-user-registering', errorMessage, 400, true);
    }
}
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
function getCustomErrorMessage(errors) {
    let errorMessage = 'Validation failed: ';
    // eslint-disable-next-line no-restricted-syntax
    for (const error of errors) {
        console.log(error);
        switch (error.keyword) {
            case 'minLength':
                // eslint-disable-next-line no-case-declarations
                const field = error.instancePath.substring(1);
                errorMessage += `${field} ${error.message}. `;
                break;
            case 'pattern':
                if (error.dataPath === '.email') {
                    errorMessage += `Invalid email format. `;
                }
                break;
            default:
                errorMessage += `${error.message}. `;
                break;
        }
    }
    return errorMessage;
}
