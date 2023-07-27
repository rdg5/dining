import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';
import { getUserModel } from './user-model';

export interface PermissionModelFields
  extends Model<
    InferAttributes<PermissionModelFields>,
    InferCreationAttributes<PermissionModelFields>
  > {
  id: CreationOptional<number>;
  ability: string;
  userId: number;
  roleId: number;
  teamId: number;
}

export function getPermissionModel() {
  const permissionModel = getDbConnection().define<PermissionModelFields>(
    'Permission',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ability: {
        type: DataTypes.STRING,
      },
      userId: {
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
  permissionModel.belongsToMany(getUserModel(), {
    through: 'UserTeam', // The junction table name for User and Team
    foreignKey: 'permissionId', // The foreign key in the junction table referencing Team
    otherKey: 'userId', // The foreign key in the junction table referencing User
  });

  return permissionModel;
}
