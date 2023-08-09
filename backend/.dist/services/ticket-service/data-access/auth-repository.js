"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsername = exports.saveNewUser = void 0;
/* eslint-disable no-console */
const user_model_1 = require("./models/user-model");
const role_model_1 = require("./models/role-model");
async function saveNewUser(newUserData) {
    try {
        const addedUser = await (0, user_model_1.getUserModel)().create(newUserData, {
            attributes: ['id', 'username', 'email'],
            raw: true,
        });
        return addedUser;
    }
    catch (error) {
        console.error('Error in saveNewUser:', error);
        throw error;
    }
}
exports.saveNewUser = saveNewUser;
async function getUserByUsername(email) {
    try {
        const foundUser = await (0, user_model_1.getUserModel)().findOne({ where: { email } }, { include: [(0, role_model_1.getRoleModel)()] });
        return foundUser;
    }
    catch (error) {
        console.error('Error in getUserByUserName:', error);
        throw error;
    }
}
exports.getUserByUsername = getUserByUsername;
