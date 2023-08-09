"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserValidator = exports.loginSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const validation_1 = __importDefault(require("@practica/validation"));
exports.loginSchema = typebox_1.Type.Object({
    email: typebox_1.Type.RegEx(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
    password: typebox_1.Type.String({ minLength: 8 }),
});
function loginUserValidator() {
    const validator = validation_1.default.getSchema('login-user');
    if (!validator) {
        validation_1.default.addSchema(exports.loginSchema, 'login-user');
    }
    return validation_1.default.getSchema('login-user');
}
exports.loginUserValidator = loginUserValidator;
