import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';
import { getUserModel } from './user-model';

export interface RoleModelFields
  extends Model<
    InferAttributes<RoleModelFields>,
    InferCreationAttributes<RoleModelFields>
  > {
  id: CreationOptional<number>;
  role: string;
  userId: number;
  permissionId: number;
  teamId: number;
}

export function getRoleModel() {
  const roleModel = getDbConnection().define<RoleModelFields>(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      permissionId: {
        type: DataTypes.INTEGER,
      },
      teamId: {
        type: DataTypes.INTEGER,
      },
    },
    { freezeTableName: true }
  );
  roleModel.belongsToMany(getUserModel(), {
    through: 'UserTeam', // The junction table name for User and Team
    foreignKey: 'roleId', // The foreign key in the junction table referencing Team
    otherKey: 'userId', // The foreign key in the junction table referencing User
  });
  return roleModel;
}
