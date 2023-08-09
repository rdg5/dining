/* eslint-disable no-console */
import { getUserModel } from './models/user-model';
import { RoleModelFields, getRoleModel } from './models/role-model';

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
  deletedAt: number;
};

type LoginRecord = {
  id: number;
  email: string;
  password: string;
  Roles: RoleModelFields[];
};

export async function saveNewUser(
  newUserData: Omit<UserRecord, 'id'>
): Promise<UserRecord | null> {
  try {
    const addedUser = await getUserModel().create(newUserData, {
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    const memberRole = await getRoleModel().findOne({
      where: { role: 'Member' },
    });
    if (memberRole) {
      await addedUser.setRoles(memberRole);
    }
    return addedUser;
  } catch (error) {
    console.error('Error in saveNewUser:', error);
    throw error;
  }
}

export async function getUserByUsername(
  email: string
): Promise<LoginRecord | null> {
  try {
    const foundUser = await getUserModel().findOne({
      where: { email },
      include: [getRoleModel()],
    });
    return foundUser;
  } catch (error) {
    console.error('Error in getUserByUserName:', error);
    throw error;
  }
}
