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
exports.refreshTokenGenerator = exports.login = exports.register = void 0;
/* eslint-disable no-console */
const ajv_cache_1 = __importDefault(require("@practica/validation/ajv-cache"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const configurationProvider = __importStar(require("@practica/configuration-provider"));
const error_handling_1 = require("@practica/error-handling");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("./Schemas/user-schema");
const userRepository = __importStar(require("../data-access/user-repository"));
const authRepository = __importStar(require("../data-access/auth-repository"));
const login_schema_1 = require("./Schemas/login-schema");
async function register(requestBody) {
    assertUserIsValid(requestBody);
    await assertEmailAndUsernameAreUnique(requestBody);
    requestBody.password = await bcrypt_1.default.hash(requestBody.password, 12);
    return await authRepository.saveNewUser(requestBody);
}
exports.register = register;
async function login(requestBody) {
    assertLoginIsValid(requestBody);
    return await assertLoginIsSuccessful(requestBody);
}
exports.login = login;
function refreshTokenGenerator(jwtToken, refreshToken) {
    const validTokens = assertThatTokensAreValid(jwtToken, refreshToken);
    const newAccessToken = generateNewToken(validTokens);
    return { newAccessToken, validTokens };
}
exports.refreshTokenGenerator = refreshTokenGenerator;
function assertUserIsValid(userToBeCreated) {
    const isValid = ajv_cache_1.default.validate(user_schema_1.userSchema, userToBeCreated);
    if (isValid === false && ajv_cache_1.default.errors) {
        const errorMessage = getCustomErrorMessage(ajv_cache_1.default.errors);
        throw new error_handling_1.AppError('invalid-user-registering', errorMessage, 400, true);
    }
}
function assertLoginIsValid(userToLogin) {
    const isValid = ajv_cache_1.default.validate(login_schema_1.loginSchema, userToLogin);
    if (isValid === false && ajv_cache_1.default.errors) {
        const errorMessage = getCustomErrorMessage(ajv_cache_1.default.errors);
        throw new error_handling_1.AppError('invalid-user-login', errorMessage, 400, true);
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
async function assertLoginIsSuccessful(requestBody) {
    const { email, password } = requestBody;
    try {
        const foundUser = await authRepository.getUserByUsername(email);
        if (!foundUser) {
            throw new Error('Invalid email or password');
        }
        const match = await bcrypt_1.default.compare(password, foundUser.password);
        if (!match) {
            throw new Error('Invalid email or password');
        }
        const expiryTimeForJwt = Math.floor(Date.now() / 1000) + 60 * 60;
        const jwtToken = jsonwebtoken_1.default.sign({
            exp: expiryTimeForJwt,
            id: foundUser.id,
            role: foundUser.role,
        }, configurationProvider.getValue('jwtTokenSecret'));
        const expiryTimeForRefreshToken = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        const refreshToken = jsonwebtoken_1.default.sign({
            exp: expiryTimeForRefreshToken,
            id: foundUser.id,
        }, configurationProvider.getValue('refreshTokenSecret'));
        return { jwtToken, expiryTimeForJwt, refreshToken };
    }
    catch (error) {
        throw new error_handling_1.AppError('authentication-error', 'Authentication failed', 400, true);
    }
}
function assertThatTokensAreValid(jwtToken, refreshToken) {
    const accessTokenPayload = jsonwebtoken_1.default.verify(jwtToken, configurationProvider.getValue('jwtTokenSecret'));
    if (!accessTokenPayload) {
        throw new error_handling_1.AppError('verification-error', 'Invalid token', 400, true);
    }
    return jsonwebtoken_1.default.verify(refreshToken, configurationProvider.getValue('refreshTokenSecret'));
}
function generateNewToken(validTokenPayload) {
    return jsonwebtoken_1.default.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        id: validTokenPayload.id,
    }, configurationProvider.getValue('jwtTokenSecret'));
}
