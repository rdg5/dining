import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';
import { getUserModel } from './user-model';

export interface TeamModelFields
  extends Model<
    InferAttributes<TeamModelFields>,
    InferCreationAttributes<TeamModelFields>
  > {
  id: CreationOptional<number>;
  name: string;
  userId: number;
  roleId: number;
  permissionId: number;
}

export function getTeamModel() {
  const teamModel = getDbConnection().define<TeamModelFields>(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      permissionId: {
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
    },
    { freezeTableName: true }
  );
  teamModel.belongsToMany(getUserModel(), {
    through: 'UserTeam', // The junction table name for User and Team
    foreignKey: 'teamId', // The foreign key in the junction table referencing Team
    otherKey: 'userId', // The foreign key in the junction table referencing User
  });
  return teamModel;
}
