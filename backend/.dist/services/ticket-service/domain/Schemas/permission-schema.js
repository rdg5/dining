"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPermissionValidator = exports.addPermissionValidator = exports.editPermissionSchema = exports.permissionSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const validation_1 = __importDefault(require("@practica/validation"));
exports.permissionSchema = typebox_1.Type.Object({
    ability: typebox_1.Type.String({ minLength: 1 }),
});
exports.editPermissionSchema = typebox_1.Type.Object({
    ability: typebox_1.Type.String({ minLength: 1 }),
});
function addPermissionValidator() {
    const validator = validation_1.default.getSchema('add-permission');
    if (!validator) {
        validation_1.default.addSchema(exports.permissionSchema, 'add-permission');
    }
    return validation_1.default.getSchema('add-permission');
}
exports.addPermissionValidator = addPermissionValidator;
function editPermissionValidator() {
    const validator = validation_1.default.getSchema('edit-permission');
    if (!validator) {
        validation_1.default.addSchema(exports.editPermissionSchema, 'edit-permission');
    }
    return validation_1.default.getSchema('edit-permission');
}
exports.editPermissionValidator = editPermissionValidator;
