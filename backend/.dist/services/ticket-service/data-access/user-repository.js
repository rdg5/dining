"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExistingUser = exports.updateExistingUserByUser = exports.updateExistingUserById = exports.saveNewUser = exports.getSoftDeletedUserByUsernameOrEmail = exports.getUserByUsernameOrEmail = exports.getUserByUsernameOrEmailExceptCurrent = exports.getAllUsersWithTeams = exports.getUserByUserId = exports.getAllUsers = void 0;
/* eslint-disable no-console */
const sequelize_1 = require("sequelize");
const team_model_1 = require("./models/team-model");
const user_model_1 = require("./models/user-model");
async function getAllUsers() {
    try {
        const allUsers = await (0, user_model_1.getUserModel)().findAll({
            attributes: ['id', 'username', 'email'],
            raw: true,
        });
        return allUsers;
    }
    catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
}
exports.getAllUsers = getAllUsers;
async function getUserByUserId(userId) {
    try {
        const existingUserById = await (0, user_model_1.getUserModel)().findByPk(userId, {
            attributes: ['id', 'username', 'email'],
        });
        return existingUserById;
    }
    catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
}
exports.getUserByUserId = getUserByUserId;
async function getAllUsersWithTeams() {
    try {
        const allUsersWithTeams = await (0, user_model_1.getUserModel)().findAll({
            include: (0, team_model_1.getTeamModel)(),
        });
        return allUsersWithTeams;
    }
    catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
}
exports.getAllUsersWithTeams = getAllUsersWithTeams;
async function getUserByUsernameOrEmailExceptCurrent(username, email, userId) {
    try {
        const conditions = {
            [sequelize_1.Op.or]: [{ username }, { email }],
        };
        if (userId) {
            conditions[sequelize_1.Op.and] = [{ id: { [sequelize_1.Op.ne]: userId } }];
        }
        const existingUser = await (0, user_model_1.getUserModel)().findOne({
            where: conditions,
        });
        return existingUser;
    }
    catch (error) {
        console.error('Error in getUserByUsernameOrEmailExceptCurrent:', error);
        throw error;
    }
}
exports.getUserByUsernameOrEmailExceptCurrent = getUserByUsernameOrEmailExceptCurrent;
async function getUserByUsernameOrEmail(username, email) {
    try {
        const existingUser = await (0, user_model_1.getUserModel)().findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
            },
        });
        return existingUser;
    }
    catch (error) {
        console.error('Error in getUserByUsername:', error);
        throw error;
    }
}
exports.getUserByUsernameOrEmail = getUserByUsernameOrEmail;
async function getSoftDeletedUserByUsernameOrEmail(username, email) {
    try {
        const user = await (0, user_model_1.getUserModel)().findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
                deletedAt: {
                    [sequelize_1.Op.ne]: null,
                },
            },
            raw: true,
        });
        return user;
    }
    catch (error) {
        console.error('Error in getSoftDeletedUserByUsernameOrEmail:', error);
        throw error;
    }
}
exports.getSoftDeletedUserByUsernameOrEmail = getSoftDeletedUserByUsernameOrEmail;
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
async function updateExistingUserById(userId, userDetails) {
    try {
        await (0, user_model_1.getUserModel)().update(userDetails, {
            where: { id: userId },
        });
        const updatedUser = await (0, user_model_1.getUserModel)().findByPk(userId, {
            attributes: ['id', 'username', 'email'],
            raw: true,
        });
        return updatedUser;
    }
    catch (error) {
        console.error('Error in updateExistingUser', error);
        throw error;
    }
}
exports.updateExistingUserById = updateExistingUserById;
async function updateExistingUserByUser(user) {
    try {
        await (0, user_model_1.getUserModel)().update({ username: user.username, email: user.email }, { where: { id: user.id } });
        return user;
    }
    catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
    }
}
exports.updateExistingUserByUser = updateExistingUserByUser;
async function deleteExistingUser(userId) {
    try {
        const userToBeDeleted = await (0, user_model_1.getUserModel)().findByPk(userId, {
            attributes: ['id', 'username', 'email'],
            raw: true,
        });
        await (0, user_model_1.getUserModel)().destroy({
            where: {
                id: userId,
            },
        });
        return userToBeDeleted;
    }
    catch (error) {
        console.error('Error in deleteExistingUser', error);
        throw error;
    }
}
exports.deleteExistingUser = deleteExistingUser;
