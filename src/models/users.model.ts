<<<<<<< dev-deni
import { DataTypes, Model, Optional } from "sequelize";
import db from "../db/connection";
=======
import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/connection';
>>>>>>> development

// Definir la interfaz de atributos del usuario
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  verified_email?: boolean;
  status?: boolean;
  driverId?: string;
<<<<<<< dev-deni
  customerId?: string;
}

// Interfaz para los atributos opcionales al crear un usuario
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}
=======
}

// Interfaz para los atributos opcionales al crear un usuario
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}
>>>>>>> development

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
<<<<<<< dev-deni
  public customerId?: string;
=======
>>>>>>> development
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
    /* lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identification_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },*/
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /* role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },*/
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
<<<<<<< dev-deni
        model: "drivers",
        key: "id",
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "customers",
        key: "id",
=======
        model: 'drivers',
        key: 'id',
>>>>>>> development
      },
    },
  },
  {
    sequelize: db,
<<<<<<< dev-deni
    tableName: "users",
=======
    tableName: 'users',
>>>>>>> development
    timestamps: false,
  }
);

export default Users;
