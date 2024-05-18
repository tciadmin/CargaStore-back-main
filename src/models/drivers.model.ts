import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/connection';

// Definir la interfaz de atributos del conductor
interface DriverAttributes {
  id: string;
  picture: string;
  num_license: number;
  exp_license: Date;
  iess?: boolean; // iess no es necesario para crear un conductor porque tiene un default value en false
  description: string;
  userId: number;
}

// Interfaz para los atributos opcionales al crear un conductor
interface DriverCreationAttributes
  extends Optional<DriverAttributes, 'id'> {}

// Definir el modelo del conductor
class Drivers
  extends Model<DriverAttributes, DriverCreationAttributes>
  implements DriverAttributes
{
  public id!: string;
  public picture!: string;
  public num_license!: number;
  public exp_license!: Date;
  public iess!: boolean;
  public description!: string;
  public userId!: number;
}

Drivers.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_license: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exp_license: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    iess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    tableName: 'drivers',
    timestamps: false,
  }
);

export default Drivers;
