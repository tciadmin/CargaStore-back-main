import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/connection';

// Definir la interfaz de atributos del usuario
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  verified_email?: boolean;
  status?: boolean;
  driverId?: string;
}

// Interfaz para los atributos opcionales al crear un usuario
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

// Definir el modelo del usuario
class Users
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public verified_email!: boolean;
  public status!: boolean;
  public driverId?: string;
}

Users.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified_email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'drivers',
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    tableName: 'users',
    timestamps: false,
  }
);

export default Users;
