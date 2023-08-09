"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveNewUser = void 0;
const user_model_1 = require("./models/user-model");
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
