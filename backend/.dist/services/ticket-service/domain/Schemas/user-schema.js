"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserValidator = exports.addUserValidator = exports.editUserSchema = exports.userSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const validation_1 = __importDefault(require("@practica/validation"));
exports.userSchema = typebox_1.Type.Object({
    username: typebox_1.Type.String({ minLength: 4 }),
    email: typebox_1.Type.RegEx(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
    password: typebox_1.Type.String({ minLength: 8 }),
});
exports.editUserSchema = typebox_1.Type.Object({
    username: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 1 })),
    email: typebox_1.Type.Optional(typebox_1.Type.RegEx(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)),
    password: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 1 })),
}, { additionalProperties: false, minProperties: 1 });
function addUserValidator() {
    const validator = validation_1.default.getSchema('add-user');
    if (!validator) {
        validation_1.default.addSchema(exports.userSchema, 'add-user');
    }
    return validation_1.default.getSchema('add-user');
}
exports.addUserValidator = addUserValidator;
function editUserValidator() {
    const validator = validation_1.default.getSchema('edit-user');
    if (!validator) {
        validation_1.default.addSchema(exports.editUserSchema, 'edit-user');
    }
    return validation_1.default.getSchema('edit-user');
}
exports.editUserValidator = editUserValidator;
