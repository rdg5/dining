import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

export interface TeamModelFields
  extends Model<
    InferAttributes<TeamModelFields>,
    InferCreationAttributes<TeamModelFields>
  > {
  id: CreationOptional<number>;
  name: string;
}

export function getOrderModel() {
  const teamModel = getDbConnection().define<TeamModelFields>(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    { freezeTableName: true }
  );
  return teamModel;
}
