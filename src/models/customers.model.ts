import { DataTypes, Model, Optional } from "sequelize";
import db from "../db/connection";

// Definir la interfaz de atributos del cliente
interface CustomerAttributes {
  id?: string;
  company_name: string;
  cuit: number;
  company_phone: string;
  userId?: number;
}

// Interfaz para los atributos opcionales al crear un conductor
interface CustomerCreationAttributes
  extends Optional<CustomerAttributes, "id"> {}

class Customers
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  public id!: string;
  public company_name!: string;
  public cuit!: number;
  public company_phone!: string;
  public userId!: number;
}
Customers.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    tableName: "customers",
    timestamps: false,
  }
);

export default Customers;
