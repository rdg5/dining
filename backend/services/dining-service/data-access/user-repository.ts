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
  // eslint-disable-next-line no-console
  console.log('About to fetch all users with permissions...');

  try {
    const awesomeCaptain = await getUserModel().findAll({
      include: [
        {
          model: getTeamModel(),
          through: 'UserTeam',
        },
        {
          model: getPermissionModel(),
          through: 'UserPermission',
        },
      ],
    });
    // eslint-disable-next-line no-console
    console.log(awesomeCaptain);
    return awesomeCaptain;

    // const oneUser = await getUserModel().findByPk(1, {
    //   include: [
    //     {
    //       model: getRoleModel(),
    //       through: { attributes: [] }, // this will exclude the join table attributes
    //     },
    //   ],
    // });
    // return oneUser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getAllUsers:', error);
    throw error; // Rethrow the error to be handled at the higher level
  }
}
