import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

export interface PermissionModelFields
  extends Model<
    InferAttributes<PermissionModelFields>,
    InferCreationAttributes<PermissionModelFields>
  > {
  id: CreationOptional<number>;
  ability: string;
}

export function getOrderModel() {
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
    },
    { freezeTableName: true }
  );
  return permissionModel;
}
