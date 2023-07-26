import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import getDbConnection from './db-connection';

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
}

export function getOrderModel() {
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
    },
    { freezeTableName: true }
  );
  return userModel;
}
