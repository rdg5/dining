import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';
import { getTeamModel } from './team-model';
import { getRoleModel } from './role-model';
import { getPermissionModel } from './permission-model';

export interface UserModelFields
  extends Model<
    InferAttributes<UserModelFields>,
    InferCreationAttributes<UserModelFields>
  > {
  id: CreationOptional<number>;
  username: string;
  email: string;
  password: string;
  verifiedAt: number;
  verificationToken: string;
  verificationTokenExpiresAt: number;
  forgottenPasswordToken: string;
  forgottenPasswordTokenExpiresAt: number;
  createdAt: number;
  roleId: number;
  permissionId: number;
  teamId: number;
}

export function getUserModel() {
  const userModel = getDbConnection().define<UserModelFields>(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      verifiedAt: {
        type: DataTypes.DATE,
      },
      verificationToken: {
        type: DataTypes.STRING,
      },
      verificationTokenExpiresAt: {
        type: DataTypes.DATE,
      },
      forgottenPasswordToken: {
        type: DataTypes.STRING,
      },
      forgottenPasswordTokenExpiresAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      permissionId: {
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
      teamId: {
        type: DataTypes.INTEGER,
      },
    },
    { freezeTableName: true }
  );
  userModel.belongsToMany(getRoleModel(), {
    through: 'userRole',
    foreignKey: 'userId',
    otherKey: 'roleId',
  });
  userModel.belongsToMany(getTeamModel(), {
    through: 'UserTeam',
    foreignKey: 'userId',
    otherKey: 'teamId',
  });
  userModel.belongsToMany(getPermissionModel(), {
    through: 'UserPermission',
    foreignKey: 'userId',
    otherKey: 'permissionId',
  });
  return userModel;
}
