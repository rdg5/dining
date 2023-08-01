/* eslint-disable no-console */
import { Op } from 'sequelize';
import { getPermissionModel } from './models/permission-model';
import { getRoleModel } from './models/role-model';
import { getTeamModel } from './models/team-model';
import { getUserModel } from './models/user-model';

type UserRecord = {
  id: number;
  username: string;
  email: string;
  password: string;
  verifiedAt: number;
  verificationToken: string;
  verificationTokenExpiresAt: number;
  forgottenPasswordToken: string;
  forgottenPasswordTokenExpiresAt: number;
  createdAt: number;
  updatedAt: number;
};

export async function getAllUsers(): Promise<UserRecord[] | null> {
  try {
    const allUsers = getUserModel().findAll({ raw: true });
    return allUsers;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export async function getAllUsersWithTeams(): Promise<UserRecord[] | null> {
  try {
    const allUsersWithTeams = getUserModel().findAll({
      include: getTeamModel(),
    });
    return allUsersWithTeams;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export async function getUserByUsernameOrEmail(
  username: string,
  email: string
) {
  try {
    const existingUser = await getUserModel().findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
      raw: true,
    });
    return existingUser;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
}

export async function saveNewUser(
  newUserData: Omit<UserRecord, 'id'>
): Promise<UserRecord[] | null> {
  try {
    const addedUser = await getUserModel().create(newUserData);
    return addedUser;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}
