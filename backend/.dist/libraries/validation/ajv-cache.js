"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
// This file is used to provide a 'singleton' AJV instance for the entire app so
// every client can cache the compiled schemas
const ajv = new ajv_1.default();
ajv.addKeyword('kind');
ajv.addKeyword('modifier');
exports.default = ajv;
