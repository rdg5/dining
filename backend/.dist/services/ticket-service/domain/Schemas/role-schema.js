"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editRoleValidator = exports.addRoleValidator = exports.editRoleSchema = exports.roleSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const validation_1 = __importDefault(require("@practica/validation"));
exports.roleSchema = typebox_1.Type.Object({
    role: typebox_1.Type.String({ minLength: 1 }),
});
exports.editRoleSchema = typebox_1.Type.Object({
    role: typebox_1.Type.String({ minLength: 1 }),
});
function addRoleValidator() {
    const validator = validation_1.default.getSchema('add-role');
    if (!validator) {
        validation_1.default.addSchema(exports.roleSchema, 'add-role');
    }
    return validation_1.default.getSchema('add-role');
}
exports.addRoleValidator = addRoleValidator;
function editRoleValidator() {
    const validator = validation_1.default.getSchema('edit-role');
    if (!validator) {
        validation_1.default.addSchema(exports.editRoleSchema, 'edit-role');
    }
    return validation_1.default.getSchema('edit-role');
}
exports.editRoleValidator = editRoleValidator;
