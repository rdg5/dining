import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

export interface RoleModelFields
  extends Model<
    InferAttributes<RoleModelFields>,
    InferCreationAttributes<RoleModelFields>
  > {
  id: CreationOptional<number>;
  role: string;
}

export function getOrderModel() {
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
    },
    { freezeTableName: true }
  );
  return roleModel;
}
