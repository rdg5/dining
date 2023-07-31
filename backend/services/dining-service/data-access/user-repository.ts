// export async function getOrderById(id: number): Promise<OrderRecord | null> {
//   const foundOrder = await getOrderModel().findOne({
//     where: { id },
//     include: getCountryModel(),
//     // ✅ Best Practice: The data access layer should return a plain JS object and avoid leaking DB narratives outside
//     // The 'Raw' option below instructs to include only pure data within the response
//     raw: true,
//     nest: true,
//   });

import { getPermissionModel } from './models/permission-model';
import { getRoleModel } from './models/role-model';
import { getTeamModel } from './models/team-model';
import { getUserModel } from './models/user-model';

//   return foundOrder;
// }

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
    const allUsers = getUserModel().findAll();
    return allUsers;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getAllUsers:', error);
    throw error; // Rethrow the error to be handled at the higher level
  }
}

export async function getAllUsersWithTeams(): Promise<UserRecord[] | null> {
  try {
    const allUsersWithTeams = getUserModel().findAll({
      include: getTeamModel(),
    });
    return allUsersWithTeams;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getAllUsers:', error);
    throw error; // Rethrow the error to be handled at the higher level
  }
}
