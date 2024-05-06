import { DataTypes } from "sequelize";
import db from "../db/connection";
import Users from "./users.model";

const Customers = db.define(
  "customers",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
  },
  { updatedAt: false }
);

// Establece la relación entre Customers y User
Customers.belongsTo(Users, { foreignKey: "userId" });
export default Customers;
