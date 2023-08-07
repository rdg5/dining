/* eslint-disable no-console */
import { Op } from 'sequelize';
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
  deletedAt: number;
};

export async function saveNewUser(
  newUserData: Omit<UserRecord, 'id'>
): Promise<UserRecord | null> {
  try {
    const addedUser = await getUserModel().create(newUserData, {
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    return addedUser;
  } catch (error) {
    console.error('Error in saveNewUser:', error);
    throw error;
  }
}
